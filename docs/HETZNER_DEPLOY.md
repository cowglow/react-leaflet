# Deploying the backend to Hetzner

This guide covers the one-time server setup for running the backend (`db` + `api`)
on a Hetzner Cloud VPS. The frontend stays on GitHub Pages. Once the server is set up
per steps 1–8 below, subsequent deploys are fully automated via GitHub Actions — see
the [Automated CI/CD](#automated-cicd) section.

> **Rebuilding after you deleted the box?** Most of this (Hetzner project, DNS zone,
> GitHub secrets, the ghcr image) survives a teardown — use the short runbook in
> [`HETZNER_REBUILD.md`](./HETZNER_REBUILD.md) instead of starting here from zero.

Replace `YOUR_SERVER_IP` below with the actual server IP throughout. The API subdomain
used throughout this guide is `api.cowglow.io` — replace it if you ever move to a
different domain.

## 0. What you'll need first

- A Hetzner Cloud account and a project created in it.
- A domain you control DNS for — here, `cowglow.io`, managed at IONOS. You do **not**
  need a domain for the frontend; that stays on GitHub Pages. `api.cowglow.io` is a
  dedicated subdomain just for this backend, so it's independent of whatever the root
  `cowglow.io`/`www.cowglow.io` records already point at (see step 2).
- A dedicated SSH key pair for this server, generated **passphrase-free** (GitHub
  Actions' SSH step can't unlock a passphrase-protected key non-interactively — using
  one is the single most common way this whole setup breaks), saved into `cert/` at
  the repo root rather than `~/.ssh` — that directory is gitignored, and keeping the
  deploy key there (instead of scattered across whichever machine happened to
  generate it) is what lets a future teardown/rebuild
  ([`HETZNER_REBUILD.md`](./HETZNER_REBUILD.md)) reuse it instead of rotating a new
  one. `ssh-keygen` ships with OpenSSH, so the command is nearly identical across
  systems — run it from the repo root:

  **macOS** — Terminal:
  ```bash
  mkdir -p cert
  ssh-keygen -t ed25519 -C "github-actions-deploy" -f cert/id_hetzner -N ""
  ```

  **Ubuntu** — Terminal (`openssh-client` is preinstalled on the desktop image; if
  missing, `sudo apt install openssh-client` first):
  ```bash
  mkdir -p cert
  ssh-keygen -t ed25519 -C "github-actions-deploy" -f cert/id_hetzner -N ""
  ```

  **Windows 11** — PowerShell (ships with the OpenSSH Client by default; if
  `ssh-keygen` isn't found, install it first with
  `Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0` in an admin
  PowerShell, or via **Settings → Optional Features → Add a feature → OpenSSH
  Client**):
  ```powershell
  New-Item -ItemType Directory -Force -Path cert | Out-Null
  ssh-keygen -t ed25519 -C "github-actions-deploy" -f cert\id_hetzner -N '""'
  ```
  If the empty-passphrase quoting above misbehaves in your shell, just omit `-N` and
  press Enter twice at the passphrase prompts instead — same result.

  Either way this gives you `cert/id_hetzner` (private — `cert\id_hetzner` on
  Windows) which goes into the `HETZNER_SSH_KEY` GitHub secret in step 8, and
  `cert/id_hetzner.pub` (public) which goes on the server below. Keep working from
  the same machine (or just keep the repo's `cert/` directory) for the rest of this
  guide — later steps assume the key is at this path.

  Also generate a second, **passphrase-protected** key for your own manual access —
  `cert/id_hetzner_admin` — so you're never using the passphrase-free CI key by hand.
  [`SSH_KEY_SETUP.md`](./SSH_KEY_SETUP.md) covers generating this kind; add both
  `.pub` files to Hetzner in step 1 below, and use `id_hetzner_admin` everywhere
  later docs ([`VALIDATE_PRODUCTION.md`](./VALIDATE_PRODUCTION.md),
  [`WEBSTORM_PG_SETUP.md`](./WEBSTORM_PG_SETUP.md),
  [`HETZNER_ROOT_LOCKDOWN.md`](./HETZNER_ROOT_LOCKDOWN.md)) call for "the admin key."

## 1. Provision the server

**Add the SSH key to Hetzner *before* creating the server** — Hetzner Cloud's
project-level SSH key manager (Console → **Security → SSH Keys**) only gets injected
into servers created (or rebuilt) *after* the key was added. Adding a key there while
a server already exists does **nothing** to that server's `authorized_keys` — there's
no retroactive push. If you add the key after the fact, you'll get a server you can't
SSH into and have to delete and recreate it. So:

1. Console → **Security → SSH Keys → Add SSH Key** → paste the contents of
   `cert/id_hetzner.pub` **and** `cert/id_hetzner_admin.pub` (two entries).
2. *Then* create the server, and in the "SSH keys" field during creation, select
   both keys you just added.

Other server settings, in the Hetzner Cloud console (or via the `hcloud` CLI if you
have it):

- **Image**: Ubuntu 24.04 LTS.
- **Type**: the cheapest shared vCPU type (CX22 or similar) is plenty for this app's
  scale — a hand-written REST API and Postgres for a leadership roster, not a
  high-traffic service. You can resize later if needed.
- **Location**: pick an EU location (Falkenstein or Nuremberg) — matches the plan's
  data-sovereignty reasoning for choosing Hetzner in the first place.
- **Firewall**: create a Hetzner Cloud Firewall (not just `ufw` on the box — belt and
  suspenders, but the cloud firewall is the one that actually matters if `ufw` is
  ever misconfigured) allowing inbound:
  - `22/tcp` (SSH) — ideally restricted to your own IP if it's stable.
  - `80/tcp` and `443/tcp` (HTTP/HTTPS, for Caddy below).
  - **Nothing else.** Do not open `4000` (the API's raw port), `5432` (Postgres), or
    `8081` (Adminer) to the public internet — see step 5 for why, and how you still
    get to Adminer safely.

Note the server's public IP once it's created — that's `YOUR_SERVER_IP` below. Verify
the key actually works before doing anything else:
```bash
ssh -i cert/id_hetzner root@YOUR_SERVER_IP whoami
# should print "root" with no password prompt
```

## 2. Point DNS at it

Domain is `cowglow.io`, managed at **IONOS**. Add a new `A` record for the `api`
subdomain — this is independent of whatever `cowglow.io`/`www.cowglow.io` already
point at (likely a separate GitHub Pages project via its own `A`/`CNAME` records —
check first so you don't confuse the two later, but you can't break it by adding an
unrelated subdomain).

**In the IONOS control panel:**

1. Log in at [ionos.de](https://www.ionos.de) (or `.com`) → **Domains & SSL** (German
   UI: "Domains & SSL").
2. Click into `cowglow.io` → **DNS** (German: "DNS-Einstellungen").
3. You should see the existing records here — take note of what's already on
   `cowglow.io` (root) and `www`: probably `A` records pointing at GitHub Pages' IPs
   (`185.199.108.153` etc.) or a `CNAME` to `cowglow.github.io`. Leave those alone.
4. **Add record**:
   - Type: `A`
   - Host name: `api`
   - Points to: `YOUR_SERVER_IP` (the Hetzner server's public IP from step 1)
   - TTL: default is fine (usually 1 hour or less)
5. Save.

**Verify propagation:**

```bash
dig +short api.cowglow.io
# should print YOUR_SERVER_IP once propagated
```

IONOS is usually fast (minutes), but DNS can take up to a few hours depending on TTL
and resolver caching. If `dig` shows nothing or a stale value:

- Confirm the record actually saved in the IONOS panel (page reloads/typos are the
  most common cause).
- Try a different resolver to rule out local caching: `dig +short api.cowglow.io @1.1.1.1`.
- Check you didn't accidentally create the record on the wrong zone, or as `api.cowglow.io.cowglow.io`
  (IONOS's "host name" field usually wants just `api`, not the full FQDN — double-check
  which convention their panel uses, it varies).
- If you get a result but it's wrong, `dig +trace api.cowglow.io` shows exactly which
  nameserver is answering, useful for spotting a leftover record overriding the new one.

Caddy (step 6) needs this record resolving correctly *before* it can issue a
certificate — if `curl https://api.cowglow.io/health` fails later with a TLS/cert
error, come back and re-check DNS here first.

## 3. Initial server setup

SSH in as root the first time:

```bash
ssh -i cert/id_hetzner root@YOUR_SERVER_IP
```

Install Docker (the official convenience script is fine for a fresh box):

```bash
curl -fsSL https://get.docker.com | sh
```

Create a non-root user to actually operate as (optional but good practice):

```bash
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
usermod -aG sudo deploy
echo 'deploy ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/deploy
chmod 0440 /etc/sudoers.d/deploy
visudo -cf /etc/sudoers.d/deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Plain `adduser deploy` prompts interactively for a Unix password and GECOS fields
(full name, room number, ...) — easy to fat-finger or Ctrl-C out of, and if you do,
`adduser` leaves a half-created user behind that then blocks a retry with "user
already exists" (`deluser --remove-home deploy` cleans that up if it happens). Since
`deploy` only ever logs in over SSH with a key, it doesn't need a working Unix
password at all — `--disabled-password --gecos ""` creates it non-interactively with
no prompts and no usable password.

That does mean `deploy` can't authenticate an interactive `sudo` password prompt
either, so the `sudoers.d` drop-in above grants it passwordless sudo instead —
standard practice for a single-purpose deploy/automation account. `visudo -cf` at the
end validates the file's syntax before it's live, so a typo can't lock out `sudo`
entirely.

The `rsync` copies root's `authorized_keys` (i.e. `id_hetzner.pub`) to `deploy` too, so
the same key works for both without a separate copy step. From here on, SSH in as
`ssh -i cert/id_hetzner deploy@YOUR_SERVER_IP` instead of root — and this is the user
GitHub Actions should deploy as (see `HETZNER_USER` in step 8), not `root`. Once you've
confirmed `deploy` works, consider following [`HETZNER_ROOT_LOCKDOWN.md`](./HETZNER_ROOT_LOCKDOWN.md)
to disable root SSH login entirely.

## 4. Set the GitHub Secrets that drive the deploy

There's no manual `git clone`, no hand-written `.env`, and no editing
`docker-compose.yml` on the box — none of that is how this actually gets deployed.
The `deploy_server` job (see [Automated CI/CD](#automated-cicd) below) builds the API
image in CI, pushes it to `ghcr.io`, and on the server side only needs
`docker-compose.prod.yml` + `Caddyfile` (which it SCPs over itself) and a `.env` file
(which it writes itself, from GitHub Secrets) under `/opt/visual-directory/` — a
directory it also creates itself. The image is fully self-contained (compiled code,
`node_modules`, Prisma schema, `pnpm` all baked in via `backend/Dockerfile`), so the
server never needs the repo checked out at all.

So the one-time step here is just setting the secrets, not touching the server again.
Add everything in the [GitHub Secrets required](#github-secrets-required) table below
(`Settings → Secrets and variables → Actions`) — `HETZNER_HOST`/`HETZNER_USER`/
`HETZNER_SSH_KEY` from steps 1 and 3, plus `POSTGRES_USER`/`POSTGRES_PASSWORD`/
`POSTGRES_DB`/`JWT_SECRET`/`CLIENT_ORIGIN`/`GHCR_PAT`. Don't reuse the dev defaults in
`backend/.env.example` (`app`/`app` Postgres credentials, `dev-secret-change-me` JWT
secret) — fine for local dev where nothing is reachable from outside your machine,
not for a box on the public internet.

`RESEND_API_KEY`/`EMAIL_FROM` can be left unset for now — `getMailer()` in
`backend/src/infrastructure/mail/get-mailer.ts` falls back to `consoleMailer` (logs the magic link instead of
emailing it) whenever they're unset, so login still works. Set them up later via
[`RESEND_EMAIL_SETUP.md`](./RESEND_EMAIL_SETUP.md) when you want real email delivery.

`CLIENT_ORIGIN` must exactly match the origin your deployed frontend is served from
(protocol + host, no path) — this is what the API's CORS check compares against, so a
mismatch here means every request from the real frontend gets silently blocked by the
browser.

## 5. Push to trigger the deploy

```bash
git push origin main
```

This runs the `deploy_server` job, which builds and pushes the image, copies
`docker-compose.prod.yml`/`Caddyfile` to `/opt/visual-directory/` on the server,
writes `.env` from the secrets above, and runs
`docker compose -f docker-compose.prod.yml up -d` — bringing up `db`, `api`, and
`caddy` together (`docker-compose.prod.yml` deliberately has no `adminer` service —
see the "Adminer, when you actually need it" note in step 9 — and no frontend dev
service, since that's not how the real frontend is served). It then runs
`pnpm prisma:deploy` inside the running `api` container to apply migrations. Caddy
issues its Let's Encrypt certificate automatically on first start, as long as `80`/
`443` are reachable (firewall, step 1) and DNS resolves correctly (step 2).

Watch it run with `gh run watch --repo cowglow/visual-directory`, or check
`Settings → Actions` in the GitHub UI.

## 6. Confirm it's reachable

```bash
curl https://api.cowglow.io/health
# {"ok":true}
```

If this fails with a TLS error, re-check DNS (step 2) first — Caddy can't get a
certificate until `api.cowglow.io` actually resolves to the server.

## 7. Seed the first leader account (one-time, manual)

The automated deploy runs migrations but never the seed script — there's no account
to log in with until you create one, once:

```bash
ssh -i cert/id_hetzner deploy@YOUR_SERVER_IP
cd /opt/visual-directory
docker compose -f docker-compose.prod.yml exec api sh -c "SEED_LEADER_EMAIL=you@example.com pnpm seed"
```

## 8. Point the frontend at it

Already done: the `deploy_client` job's build step in `.github/workflows/deploy.yml`
sets `VITE_API_URL: https://api.cowglow.io` (Vite env vars are compiled into the
bundle, not read at runtime — this has to happen at build time, which is why it's a
workflow env var rather than something set on the server). Without it, the production
build would silently fall back to `http://localhost:4000` (see
`src/infrastructure/api/api-client.ts`) and every API call from the live site would
fail. Nothing further to do here — flagged so you know why it's there if you ever
touch that workflow step.

## Automated CI/CD

After the one-time setup above is complete, every push to `main` triggers the
`deploy_server` job in `.github/workflows/deploy.yml`, which:

1. Builds the API image from `backend/Dockerfile` and pushes it to
   `ghcr.io/cowglow/visual-directory-api:latest`.
2. SCPs `docker-compose.prod.yml` to `/opt/visual-directory/` on the server.
3. SSHes in, writes secrets to `/opt/visual-directory/.env` (mode `600`), pulls the
   new image, and restarts the stack with `docker compose up -d`.
4. Runs `pnpm prisma:deploy` inside the running `api` container to apply any pending
   migrations.

### GitHub Secrets required

Add these in `Settings → Secrets and variables → Actions`:

| Secret | Description |
|---|---|
| `HETZNER_HOST` | Server IP or domain |
| `HETZNER_USER` | SSH user (e.g. `deploy`) |
| `HETZNER_SSH_KEY` | Full private key (`-----BEGIN...-----END...`) |
| `POSTGRES_USER` | Database username |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DB` | Database name (e.g. `contact_book`) |
| `JWT_SECRET` | Random secret string for JWT signing |
| `CLIENT_ORIGIN` | The frontend's exact origin — scheme + host, **no path** (e.g. `https://cowglow.github.io`, not `.../visual-directory`) — must match the browser's `Origin` header exactly for CORS to pass |
| `RESEND_API_KEY` | *(optional — see [`RESEND_EMAIL_SETUP.md`](./RESEND_EMAIL_SETUP.md))* API key for sending real magic-link emails; unset means console-logged links instead |
| `EMAIL_FROM` | *(optional, same as above)* Sender address, e.g. `Visual Directory <login@mail.cowglow.io>` — domain must be verified in Resend first |
| `GHCR_PAT` | GitHub PAT with `read:packages` scope — lets the server pull the image |

To create `GHCR_PAT`: `github.com → Settings → Developer settings → Personal access
tokens → Fine-grained` with `read:packages` scope.

### Setting/updating secrets via `gh` CLI

Faster than clicking through the web UI, and the only sane way to set
`HETZNER_SSH_KEY` without mangling newlines. Whenever the server is recreated (new IP)
or the deploy key is rotated (new keypair), these three need to be updated together —
they describe how to reach a specific box as a specific user with a specific key, so a
stale value in any one of them breaks the SSH step of the workflow:

```bash
gh secret set HETZNER_HOST --repo cowglow/visual-directory --body "YOUR_SERVER_IP"
gh secret set HETZNER_USER --repo cowglow/visual-directory --body "deploy"
gh secret set HETZNER_SSH_KEY --repo cowglow/visual-directory < cert/id_hetzner
```

The rest, set once and rarely touched again:

```bash
gh secret set POSTGRES_USER --repo cowglow/visual-directory --body "app"
gh secret set POSTGRES_PASSWORD --repo cowglow/visual-directory --body "$(openssl rand -hex 24)"
gh secret set POSTGRES_DB --repo cowglow/visual-directory --body "contact_book"
gh secret set JWT_SECRET --repo cowglow/visual-directory --body "$(openssl rand -hex 32)"
gh secret set CLIENT_ORIGIN --repo cowglow/visual-directory --body "https://cowglow.github.io"
gh secret set GHCR_PAT --repo cowglow/visual-directory --body "YOUR_GHCR_PAT"
```

`RESEND_API_KEY`/`EMAIL_FROM` are skipped here on purpose — leave them unset until
you've done [`RESEND_EMAIL_SETUP.md`](./RESEND_EMAIL_SETUP.md); the `gh secret set`
commands for them are in that doc.

Verify what's set (values aren't shown, only names/update times) and re-run the
workflow to confirm the new secrets actually work end-to-end:

```bash
gh secret list --repo cowglow/visual-directory
gh workflow run deploy.yml --repo cowglow/visual-directory
gh run watch --repo cowglow/visual-directory
```

### Production compose file

`docker-compose.prod.yml` (in the repo root) is the production-only stack — no dev
frontend service, no Adminer. It uses the pre-built image from `ghcr.io` rather than
building on the server:

- `db` — Postgres 16, data in the `postgres-data` named volume, with a healthcheck.
- `api` — pulls `ghcr.io/cowglow/visual-directory-api:latest`; waits for `db` to be
  healthy before starting.

The workflow copies this file to the server on every deploy, so changes to it are
picked up automatically.

## 9. Ongoing operations

- **Logs**: `docker compose logs -f api` (or `db`, `caddy`).
- **Redeploy after a code change**: push to `main` — CI/CD handles it automatically.
  To redeploy manually: `docker compose -f docker-compose.prod.yml pull api && docker compose -f docker-compose.prod.yml up -d`.
- **New migrations**: CI/CD runs `pnpm prisma:deploy` automatically on every deploy.
  To run manually: `docker compose -f docker-compose.prod.yml exec api pnpm prisma:deploy`.
- **Backups**: `postgres-data` is a named Docker volume with no backup mechanism of
  its own. At minimum, periodically:
  `docker compose exec db pg_dump -U app contact_book > backup-$(date +%F).sql`,
  copied somewhere off the box (Hetzner Storage Box, or just `scp` it out on a cron).
  This isn't wired up as an automated job here — worth setting up before you have
  real member data on this box you'd mind losing.
- **Adminer, when you actually need it**: rather than exposing it publicly, tunnel to
  it over SSH when needed: `ssh -L 8081:localhost:8081 deploy@YOUR_SERVER_IP`, then
  `docker compose up -d adminer` on the box and visit `http://localhost:8081` on your
  own machine. Stop the `adminer` container again when you're done.
