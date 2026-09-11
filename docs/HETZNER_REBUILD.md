# Rebuilding the backend server from scratch

You deleted the Hetzner VPS. This is the runbook to bring the backend
(`db` + `api` + `caddy`) back up on a fresh box. It's the short version of
[`HETZNER_DEPLOY.md`](./HETZNER_DEPLOY.md) — read that for the *why* behind any step;
this one is just the ordered checklist with the real values filled in.

Frontend is unaffected — it's on GitHub Pages and doesn't touch this server.

Everything below assumes `api.cowglow.io` (the API subdomain) and the
`cowglow/visual-directory` repo. `gh` and `ssh` must be installed and `gh auth login`
already done.

## What survived the teardown vs. what you rebuild

| Survived — leave alone | Rebuild / update |
|---|---|
| Hetzner Cloud **project** | The **server** (new box, new IP) |
| IONOS DNS **zone** for `cowglow.io` | The `api` **A record's value** (new IP) |
| GitHub repo + **11 of 12 secrets** (incl. `HETZNER_SSH_KEY`, set from `cert/id_hetzner`) | `HETZNER_HOST` secret (new IP) |
| SSH keypair in `cert/` (`id_hetzner` CI, `id_hetzner_admin` personal) | The `.pub` keys added to the new Hetzner server *before* it's created |
| The API image on `ghcr.io` | A fresh **SSH keypair** |
| `.github/workflows/deploy.yml`, `docker-compose.prod.yml`, `Caddyfile` | The first **leader account** (DB volume is gone → re-seed) |

The database volume went with the box, so **all member/org data is gone** and you
re-seed one leader account at the end.

---

## 0. Set these once in your terminal

```bash
export SERVER_IP=                        # fill in after step 2
export SSH_KEY=cert/id_hetzner           # existing CI deploy key (repo-local, gitignored)
export ADMIN_KEY=cert/id_hetzner_admin   # your personal key, for manual SSH
export REPO=cowglow/visual-directory
```

## 1. SSH keys — reuse the existing ones

The repo already carries them in `cert/` (gitignored, never committed):

- **`cert/id_hetzner`** (+ `.pub`) — the passphrase-free CI deploy key
  (`github-actions-deploy`). The `HETZNER_SSH_KEY` GitHub secret was set from this,
  so it should still match — you likely won't touch it in step 5.
- **`cert/id_hetzner_admin`** (+ `.pub`) — your personal (passphrase-protected) key
  for logging in by hand.

Only generate a fresh key if `cert/id_hetzner` is missing or you want to rotate:
`ssh-keygen -t ed25519 -C hetzner-deploy -f cert/id_hetzner -N ""`, then you *must*
`gh secret set HETZNER_SSH_KEY --repo "$REPO" < cert/id_hetzner` in step 5.

Confirm the CI key has no passphrase (CI can't unlock one — the most common cause of
a broken deploy):

```bash
ssh-keygen -y -P "" -f "$SSH_KEY" >/dev/null && echo "ok, no passphrase"
```

## 2. Provision the server

**Add the key to Hetzner *before* creating the server** — Hetzner only injects keys
that existed at create time; adding one to an existing box does nothing.

1. Hetzner Console → **Security → SSH Keys → Add SSH Key** → paste
   `cert/id_hetzner.pub` **and** `cert/id_hetzner_admin.pub` (two entries). An old
   server's copies may still be listed — a duplicate public key is rejected, so
   either delete the stale one or reuse it.
2. Console → **Servers → Add Server**:
   - **Image**: Ubuntu 24.04 LTS
   - **Type**: CX22 (cheapest shared vCPU — plenty)
   - **Location**: Falkenstein or Nuremberg (EU)
   - **SSH keys**: select **both** keys from step 1
   - **Firewall**: attach one allowing inbound **only** `22/tcp`, `80/tcp`,
     `443/tcp`. If your old firewall still exists in the project, just re-attach it.
     Do **not** open `4000`, `5432`, or `8081`.
3. Copy the server's public IP → `export SERVER_IP=<that ip>`.
4. Smoke-test the key:

```bash
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=accept-new root@"$SERVER_IP" whoami
# -> root   (no password prompt)
```

If this asks for a password or says "Permission denied (publickey)", the key on the
box doesn't match — recreate the server with the key selected (step 2.2), don't try to
patch `authorized_keys` after the fact.

## 3. Repoint DNS

The `api` A record at IONOS still exists but points at the dead box. Update its value.

1. [ionos.de](https://www.ionos.de) → **Domains & SSL** → `cowglow.io` → **DNS**.
2. Edit the existing **A** record, host `api` → set **Points to** = `$SERVER_IP`.
   Leave the root `cowglow.io` / `www` records alone.
3. Verify (may take minutes to an hour):

```bash
dig +short api.cowglow.io @1.1.1.1
# -> $SERVER_IP
```

Caddy can't issue its TLS cert until this resolves to the new box, so don't skip the
verify.

## 4. Bootstrap the box

```bash
ssh -i "$SSH_KEY" root@"$SERVER_IP"
```

Then, on the server:

```bash
# Docker
curl -fsSL https://get.docker.com | sh

# non-root deploy user (this is who CI logs in as)
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
usermod -aG sudo deploy
echo 'deploy ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/deploy
chmod 0440 /etc/sudoers.d/deploy
visudo -cf /etc/sudoers.d/deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

exit
```

Confirm `deploy` works before moving on:

```bash
ssh -i "$SSH_KEY" deploy@"$SERVER_IP" 'docker --version'
```

## 5. Sync the GitHub secrets

Reusing `cert/id_hetzner`, **only `HETZNER_HOST` changes** — the `HETZNER_SSH_KEY`
secret was already set from that key. **`HETZNER_HOST` must be the new IP** or the
deploy's SSH/SCP step fails with `handshake failed: unable to authenticate`.

```bash
gh secret set HETZNER_HOST  --repo "$REPO" --body "$SERVER_IP"
gh secret set HETZNER_USER  --repo "$REPO" --body "deploy"          # unchanged; harmless to re-set

# ONLY if you rotated the key in step 1 (or the deploy still fails auth after the
# new box has cert/id_hetzner.pub in authorized_keys):
gh secret set HETZNER_SSH_KEY --repo "$REPO" < cert/id_hetzner      # the PRIVATE key file
```

Then confirm the rest are still present (values aren't shown):

```bash
gh secret list --repo "$REPO"
```

You should see `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`,
`CLIENT_ORIGIN`, `GHCR_PAT`. If `GHCR_PAT` is older than ~a year it may have expired
(fine-grained PATs do) — regenerate at **GitHub → Settings → Developer settings →
Personal access tokens → Fine-grained**, scope `read:packages`, and
`gh secret set GHCR_PAT --repo "$REPO" --body "<new pat>"`.

`CLIENT_ORIGIN` must be `https://cowglow.github.io` (scheme + host, no path) — it's the
API's CORS allowlist.

## 6. Deploy

```bash
git commit --allow-empty -m "Redeploy to rebuilt server" && git push origin main
# or, without a commit:
gh workflow run deploy.yml --repo "$REPO"

gh run watch --repo "$REPO"
```

The `deploy_server` job builds + pushes the image, SCPs `docker-compose.prod.yml` +
`Caddyfile` to `/opt/visual-directory/`, writes `.env` from the secrets, runs
`docker compose -f docker-compose.prod.yml up -d`, then
`docker compose ... exec -T api pnpm prisma:deploy` to apply **all** migrations
(including `20260910155923_member_incomplete`) to the fresh DB.

## 7. Seed the first leader (one-time, manual)

Migrations run automatically; the seed never does. With no account you can't log in.

```bash
ssh -i "$SSH_KEY" deploy@"$SERVER_IP"
cd /opt/visual-directory
docker compose -f docker-compose.prod.yml exec api sh -c "SEED_LEADER_EMAIL=you@example.com pnpm seed"
```

**Optional — start with a populated directory.** `pnpm seed:demo` wipes all
organisations + members and inserts the curated roster in
`backend/prisma/demo-data.ts` (accounts and the audit log are untouched). Edit
that file first if you want different data, then:

```bash
docker compose -f docker-compose.prod.yml exec -e SEED_LEADER_EMAIL=you@example.com api pnpm seed:demo
exit
```

## 8. Verify

```bash
curl https://api.cowglow.io/health
# {"ok":true}
```

Check the latest migration applied (the `_prisma_migrations` table lists every one
that ran — `20260910155923_member_incomplete` should be the newest):

```bash
ssh -i "$SSH_KEY" deploy@"$SERVER_IP"
cd /opt/visual-directory
docker compose -f docker-compose.prod.yml exec api pnpm prisma migrate status
exit
```

Then open the live site (`https://cowglow.github.io/visual-directory/`), request a
magic link for the seeded email, and — since `RESEND_API_KEY` may be unset — grab the
link from the API logs:

```bash
ssh -i "$SSH_KEY" deploy@"$SERVER_IP" \
  'cd /opt/visual-directory && docker compose -f docker-compose.prod.yml logs --tail=50 api'
```

Log in, drop a normal pin and a Shift+click pin — you're back.

---

## Troubleshooting

| Symptom (in `gh run watch` or `curl`) | Cause / fix |
|---|---|
| `ssh: handshake failed: ... unable to authenticate, attempted methods [none publickey]` at the *Copy compose file* or *Deploy on Hetzner* step | `HETZNER_SSH_KEY` secret ≠ a key in the box's `authorized_keys`, or `HETZNER_HOST` is the old IP. Redo step 5 with the exact private-key file and new IP. Confirm locally first: `ssh -i "$SSH_KEY" deploy@"$SERVER_IP" whoami`. |
| `Error response from daemon: ... denied` / `manifest unknown` on `docker compose pull api` | `GHCR_PAT` expired or missing `read:packages`. Regenerate, `gh secret set GHCR_PAT`. |
| `curl https://api.cowglow.io/health` → TLS/cert error | DNS not resolving to the new box yet (step 3), or firewall not allowing `80`/`443`. Fix DNS/firewall, then `docker compose -f docker-compose.prod.yml restart caddy` on the box to retry the cert. |
| Deploy green but `/health` connection refused | `api` container crashed — `docker compose -f docker-compose.prod.yml logs api`. Usually a bad `DATABASE_URL` (check `POSTGRES_*` secrets are consistent) or the DB not healthy yet. |
| Login page loads but every request fails silently in the browser console (CORS) | `CLIENT_ORIGIN` secret doesn't exactly match the site origin — must be `https://cowglow.github.io`, no path, no trailing slash. Re-set it and redeploy. |

## When you tear it down again

1. Delete the server in the Hetzner Console (the `postgres-data` volume goes with it —
   `pg_dump` first if there's data worth keeping, see `HETZNER_DEPLOY.md` § Backups).
2. The `api` DNS record now points at nothing — harmless, you'll repoint it next
   rebuild.
3. GitHub secrets stay set; `HETZNER_HOST` is just stale (wrong IP) until the next run
   of this runbook. The keypair in `cert/` and the `HETZNER_SSH_KEY` secret carry over.
