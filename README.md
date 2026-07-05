[![Publish Site](https://github.com/cowglow/visual-directory/actions/workflows/deploy.yml/badge.svg)](https://github.com/cowglow/visual-directory/actions/workflows/deploy.yml)

# Visual Directory

A map-based contact directory for leadership organizations: leaders add members by
clicking their location on the map, assign them to organizations, mark lost contact,
and see distance between members. See `docs/PLAN.md` for the full product plan and
`docs/USER_MANUAL.md` for how to actually use the app.

## Repo layout

- **`src/`** — the frontend: React + TypeScript + Vite, deployed as a static site to
  GitHub Pages. Talks to the backend only over its REST API. See `CLAUDE.md` for the
  architecture (it's mid-migration to a layered domain/application/infrastructure/
  ports structure).
- **`server/`** — the backend: Node/Express + Prisma + Postgres. A separate,
  independently deployable service — not a workspace member of the frontend.
- **`e2e/`** — Playwright end-to-end tests driving the real frontend against the real
  backend. See `e2e/README.md`.
- **`docs/`** — `PLAN.md` (the product plan), `CLEAR_ARCHITECTURE.md` (the frontend's
  architectural style), `PHASE_*_REPORT.md` (what was built in each phase and how it
  was verified), `USER_MANUAL.md`, `HETZNER_DEPLOY.md` (production deployment guide).

## Quick start

Frontend only (map UI, no login/backend features will work):

```bash
pnpm install
pnpm dev
```

Full stack, for anything involving login, members, or organizations:

```bash
# Backend
cd server
pnpm install
cp .env.example .env               # edit DATABASE_URL etc. as needed
docker compose up -d db            # or run your own local Postgres
pnpm prisma:deploy
SEED_LEADER_EMAIL=you@example.com pnpm seed
pnpm dev

# Frontend, in another terminal
cd ..
cp .env.example .env               # VITE_API_URL should point at the backend above
pnpm dev
```

Magic-link logins are logged to the backend's own console — there's no real email
sending yet (see `docs/PHASE_3_REPORT.md`).

## Commands

Frontend (repo root):

```bash
pnpm dev          # start dev server
pnpm build        # tsc && vite build
pnpm lint         # eslint src e2e
pnpm test         # vitest --coverage (unit tests)
pnpm test:e2e     # playwright test (requires the backend running — see e2e/README.md)
pnpm format       # prettier . --write
```

Backend (`server/`):

```bash
pnpm dev              # tsx watch src/index.ts
pnpm build            # tsc
pnpm prisma:migrate   # create a new migration (dev)
pnpm prisma:deploy    # apply existing migrations
pnpm seed             # bootstrap the first leader account (SEED_LEADER_EMAIL=...)
pnpm test             # vitest run
```

## Deploying

Frontend deploys automatically to GitHub Pages on push to `main`
(`.github/workflows/deploy.yml`). Backend deployment is manual — see
`docs/HETZNER_DEPLOY.md`.
