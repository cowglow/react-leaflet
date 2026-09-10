# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A map-based contact directory for leadership organizations: leaders add members by
clicking their location on the map, assign them to organizations, mark lost contact,
and see distance between members. Full product context is in `docs/PLAN.md`; the
frontend's architectural style is in `docs/CLEAR_ARCHITECTURE.md`.

Two independently deployable pieces:

- **`src/`** — React + TypeScript + Vite frontend, built as a static site and deployed
  to GitHub Pages (`gh-pages` branch) on every push to `main`. Talks to the backend
  only through its REST API, at whatever `VITE_API_URL` was baked in at build time —
  never touches Postgres directly.
- **`server/`** — Node/Express + Prisma + Postgres backend, not a workspace member of
  the frontend (separate `package.json`/`pnpm-lock.yaml`). Runs as `db` + `api` +
  `caddy` on a Hetzner VPS via `docker-compose.prod.yml`; the `deploy_server` job in
  `.github/workflows/deploy.yml` builds the image, deploys, and runs
  `prisma migrate deploy` on every push to `main`. Setup: `docs/HETZNER_DEPLOY.md`;
  rebuilding after a teardown: `docs/HETZNER_REBUILD.md`.

## Commands

Frontend (repo root):

```bash
pnpm dev                              # vite dev server on :3000
pnpm dev:all                          # backend up + dev server + Storybook, one terminal
pnpm build                            # tsc && vite build
pnpm lint                             # eslint src e2e --max-warnings 0
pnpm test                             # vitest --coverage
pnpm test -- path/to/file.test.ts     # run a single unit test file
pnpm test:e2e                         # playwright test (requires backend running, see e2e/README.md)
pnpm format                           # prettier . --write
pnpm storybook                        # storybook dev on :6006
```

Backend (`server/`):

```bash
cd server
pnpm dev              # tsx watch src/index.ts
pnpm build            # tsc
pnpm test             # vitest run
pnpm test -- path/to/file.test.ts
pnpm prisma:migrate   # create a new dev migration
pnpm prisma:deploy    # apply existing migrations
pnpm seed             # SEED_LEADER_EMAIL=you@example.com pnpm seed — bootstrap first leader
```

Backend via Docker, from repo root (needed for e2e tests and full-stack dev — see
README for one-time `.env` setup):

```bash
pnpm backend:up        # docker compose up -d db api adminer
pnpm backend:migrate   # apply migrations inside the api container
pnpm backend:seed      # SEED_LEADER_EMAIL=... pnpm backend:seed
pnpm backend:logs
pnpm backend:down
```

Unit tests only cover `*.test.ts` files (not `.tsx`) on both sides — see
`vitest.config.ts` / `server/vitest.config.ts`. E2E tests (`e2e/*.spec.ts`) run against
a real frontend + real backend + real Postgres, single-worker (not parallel — several
specs share the one seeded leader account), see `e2e/README.md`.

## Architecture (frontend)

`src/` follows the **Clear Architecture** pattern (`docs/CLEAR_ARCHITECTURE.md`): a
dependency rule where each layer may only depend on itself or layers inward of it.

- **`domain/`** — business types and factories, no framework dependencies. `member/`,
  `organization/`, `marker/` (the `GeoCoordinate` type), `shared/` (cross-domain types
  like the `Region → Headquarter → Area → District` organization hierarchy).
- **`application/`** — use-case logic built on domain types: `csv/` (roster
  import/export), `geojson/` (roster → GeoJSON `FeatureCollection`, export only),
  `geo/` (bearing, distance, bounding-box).
- **`infrastructure/`** — framework/3rd-party bindings: `redux/` (Redux Toolkit slices
  + selectors per domain, `redux-saga` for async flows, wired together in `store.ts`),
  `api/` (REST client for the backend), `csv/`, `tile-server/` (raster basemap sources
  + `rasterStyle()`, the MapLibre style JSON the map renders), `geo-simulation/`.
- **`ports/`** — the public/UI surface: `components/` (React components, grouped by
  feature area — `map/`, `markers/`, `forms/`, `dialogs/`, `auth/`, etc.),
  `context/` (React context providers: dialogs, i18n, tile server config), `hooks/`,
  `i18n/`, `config/`, `testing/` (Storybook fixtures).

Imports are absolute from `src/` (e.g. `ports/components/map/MembersMap.tsx`, not a
relative path) — enabled via `baseUrl: "./src"` in `tsconfig.json` and the
`vite-tsconfig-paths` plugin, not a bundler alias to reproduce elsewhere.

Role gating (`member` = read-only, `leader` = read/write) is enforced both in the UI
(`infrastructure/redux/auth/auth.selectors.ts`'s `isLeader`, gating things like
click-to-add-member on the map in `App.tsx`) and, authoritatively, on the backend — the
frontend check is a UX convenience, not the security boundary.

## Architecture (backend)

`server/src/` is a flat Express app, not layered like the frontend:

- **`routes/`** — one router per resource (`auth`, `members`, `organizations`), mounted
  in `app.ts`.
- **`auth/`** — magic-link email login: `magic-link.ts` issues/verifies single-use
  tokens, `jwt.ts` issues/verifies the session JWT after that, `middleware.ts` exposes
  `requireAuth` (populates `req.account` from the bearer token) and `requireRole(role)`
  for per-route authorization, `mailer.ts` sends via Resend in production and logs to
  console when `NODE_ENV !== "production"` (no real email account needed for local dev).
- **`db/prisma.ts`** — the Prisma client singleton; `prisma/schema.prisma` is the
  source of truth for the data model (`Account`, `Member`, `Organization`,
  `MagicLinkToken`, `AuditLogEntry`).
- **`audit/audit-log.ts`** — every write appends a hash-chained, append-only audit
  entry: `hash = sha256(prevHash + canonicalJson(entry))`, computed and stored
  atomically with the underlying write. This is tamper-evidence for a single trusted
  server, not a distributed-consensus mechanism — don't over-engineer around it.
  `lib/canonical-json.ts` is what makes the hash input deterministic; changing its
  output format breaks verification of every prior chain entry.
- **`middleware/error-handler.ts`** + **`lib/async-handler.ts`** — route handlers are
  wrapped with `asyncHandler` so thrown/rejected errors reach the central error
  handler instead of needing try/catch in every route.

Visibility vs. edit access is intentionally asymmetric: any logged-in account (member
or leader) can read the full directory (address + contact info) — there's no redacted
view. The access boundary is *write*, not *read*. This is a trust-based tool for one
organization, not a multi-tenant product — don't add per-field visibility controls
without checking `docs/PLAN.md`'s "explicitly deferred" list first.