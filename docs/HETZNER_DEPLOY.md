# Deploying the backend to Hetzner

This is a manual, one-time setup guide for standing up the backend (`db` + `api` +
`adminer` from `docker-compose.yml`) on a Hetzner Cloud VPS, per `docs/PLAN.md`'s
Phase 3 deployment decision: the frontend deploy stays exactly as-is (GitHub Pages,
`.github/workflows/deploy.yml`), and backend deploy is manual (`docker compose up` on
the box) — no CI/CD for the backend yet, by design.

Replace `YOUR_DOMAIN` and `YOUR_SERVER_IP` below with your actual values throughout.

## 0. What you'll need first

- A Hetzner Cloud account and a project created in it.
- A domain (or subdomain) you control DNS for, e.g. `api.yourdomain.com` — this guide
  assumes you'll point that subdomain at the API. You do **not** need a domain for the
  frontend; that stays on GitHub Pages.
- An SSH key pair on your Mac (`ls ~/.ssh/id_ed25519.pub` — if you don't have one,
  `ssh-keygen -t ed25519`).

## 1. Provision the server

In the Hetzner Cloud console (or via the `hcloud` CLI if you have it):

- **Image**: Ubuntu 24.04 LTS.
- **Type**: the cheapest shared vCPU type (CX22 or similar) is plenty for this app's
  scale — a hand-written REST API and Postgres for a leadership roster, not a
  high-traffic service. You can resize later if needed.
- **Location**: pick an EU location (Falkenstein or Nuremberg) — matches the plan's
  data-sovereignty reasoning for choosing Hetzner in the first place.
- **SSH key**: add your public key during creation so you don't get a mailed root
  password.
- **Firewall**: create a Hetzner Cloud Firewall (not just `ufw` on the box — belt and
  suspenders, but the cloud firewall is the one that actually matters if `ufw` is
  ever misconfigured) allowing inbound:
  - `22/tcp` (SSH) — ideally restricted to your own IP if it's stable.
  - `80/tcp` and `443/tcp` (HTTP/HTTPS, for Caddy below).
  - **Nothing else.** Do not open `4000` (the API's raw port), `5432` (Postgres), or
    `8081` (Adminer) to the public internet — see step 5 for why, and how you still
    get to Adminer safely.

Note the server's public IP once it's created — that's `YOUR_SERVER_IP` below.

## 2. Point DNS at it

At your DNS provider, add an `A` record: `api.yourdomain.com` → `YOUR_SERVER_IP`.
DNS propagation is usually fast but can take a few minutes to an hour.

## 3. Initial server setup

SSH in as root the first time:

```bash
ssh root@YOUR_SERVER_IP
```

Install Docker (the official convenience script is fine for a fresh box):

```bash
curl -fsSL https://get.docker.com | sh
```

Create a non-root user to actually operate as (optional but good practice):

```bash
adduser deploy
usermod -aG docker deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

From here on, SSH in as `ssh deploy@YOUR_SERVER_IP` instead of root.

## 4. Get the code onto the server

Simplest approach — clone the repo directly on the box:

```bash
git clone https://github.com/cowglow/react-leaflet.git ~/app
cd ~/app
```

(If the repo is private, set up a deploy key or a personal access token for the
clone.) To update later, it's just `git pull` in this directory followed by step 7's
rebuild/restart.

## 5. Production environment variables

Do **not** reuse the dev defaults in `server/.env.example` (`app`/`app` Postgres
credentials, `dev-secret-change-me` JWT secret) — those are fine for local dev where
nothing is reachable from outside your machine, but this box is on the public
internet.

Create `~/app/.env` (used by `docker-compose.yml` for the `db`/`api` services — compose
automatically loads a `.env` file next to it):

```bash
cd ~/app
cat > .env <<'EOF'
POSTGRES_PASSWORD=<generate with: openssl rand -hex 24>
JWT_SECRET=<generate with: openssl rand -hex 32>
CLIENT_ORIGIN=https://cowglow.github.io
EOF
```

`CLIENT_ORIGIN` must exactly match the origin your deployed frontend is served
from (protocol + host, no trailing path) — this is what the API's CORS check
compares against, so a mismatch here means every request from the real frontend gets
silently blocked by the browser.

`docker-compose.yml`'s `db`/`api` services already read `POSTGRES_PASSWORD`,
`JWT_SECRET`, and `CLIENT_ORIGIN` from the environment (falling back to the dev
defaults you see in the file if unset), and `docker compose` automatically loads a
`.env` file sitting next to it — so the `.env` above is all you need; no editing
`docker-compose.yml` itself.

This is also why step 1 said not to expose `5432`/`4000`/`8081` publicly: the `db` and
`api` services only need to talk to each other over Docker's internal network, and
Adminer is a raw database UI with no auth beyond the Postgres credentials — none of
these should be reachable from the open internet at all. Only `80`/`443`, fronted by
Caddy below, should be.

## 6. Add a reverse proxy for HTTPS (Caddy)

The `api` service listens on plain HTTP internally; you need TLS termination in front
of it for a real domain. Caddy is the simplest option here — one binary, automatic
Let's Encrypt certificates, near-zero config, consistent with this project's existing
"prefer direct control, minimal extra infra" choices (same reasoning as picking
hand-written REST over Hasura).

Add a `caddy` service to `docker-compose.yml`:

```yaml
  caddy:
    image: caddy:2
    container_name: contact-book-caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddyfile
      - caddy-data:/data
    command: caddy run --config /etc/caddyfile
    depends_on:
      - api
```

and add `caddy-data:` alongside the existing `postgres-data:` under `volumes:`.

Create `~/app/Caddyfile`:

```
api.yourdomain.com {
	reverse_proxy api:4000
}
```

Caddy handles the certificate issuance and renewal automatically the first time it
starts, as long as `80`/`443` are reachable from the internet (which they are, per
the firewall rules in step 1) and DNS is pointed correctly (step 2).

## 7. Bring it up, migrate, seed

```bash
cd ~/app
docker compose up -d db api caddy
```

(Leaving `adminer` and the frontend's `react-leaflet` dev service out of the
production `up` — Adminer per the security note above; the frontend service is dev
tooling, not how the real frontend gets served.)

Run the migration and seed the first leader account:

```bash
docker compose exec api pnpm prisma:deploy
docker compose exec api sh -c "SEED_LEADER_EMAIL=you@yourdomain.com pnpm seed"
```

Confirm it's reachable:

```bash
curl https://api.yourdomain.com/health
# {"ok":true}
```

## 8. Point the frontend at it

The frontend build needs `VITE_API_URL=https://api.yourdomain.com` baked in at build
time (Vite env vars are compiled into the bundle, not read at runtime). Add it as a
step in `.github/workflows/deploy.yml`:

```yaml
      - name: Build 🚧
        run: pnpm run build
        env:
          VITE_API_URL: https://api.yourdomain.com
```

Push to `main` (or however that workflow triggers) to redeploy the frontend pointing
at the real API. Without this, the production build silently falls back to
`http://localhost:4000` (see `src/infrastructure/api/api-client.ts`) and every API
call from the live site will fail.

## 9. Ongoing operations

- **Logs**: `docker compose logs -f api` (or `db`, `caddy`).
- **Redeploy after a code change**: `git pull && docker compose up -d --build api`.
- **New migrations**: `git pull && docker compose exec api pnpm prisma:deploy`, then
  restart the `api` service if the schema change requires it.
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
