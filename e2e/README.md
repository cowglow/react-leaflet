# E2E tests

Real end-to-end tests — a headless browser driving the actual frontend against the
actual backend (Postgres + API), not mocks. Complements the unit tests under `src/`
and `server/src/`, which don't exercise the browser, network, or database at all.

## Prerequisites

This suite deliberately does not manage the backend itself. Before running it, bring
up the docker-compose stack, migrated and seeded (same steps as
`docs/HETZNER_DEPLOY.md`):

```bash
CLIENT_ORIGIN=https://localhost:5050 docker compose up -d db api
docker compose exec api pnpm prisma:deploy
docker compose exec api sh -c "SEED_LEADER_EMAIL=leader@example.com pnpm seed"
```

`CLIENT_ORIGIN` must be set to `https://localhost:5050` (the e2e suite's own dedicated
frontend port, see `helpers/config.ts`) — not the default `https://localhost:3000` —
or the API's CORS check silently blocks every request the e2e frontend makes and
every login-dependent test fails with "Something went wrong." `docker compose up`
picks up the new value and recreates the `api` container automatically, even if it
was already running with a different `CLIENT_ORIGIN` for normal dev use; switching
back to normal dev afterwards just means re-running `pnpm backend:up` (or
`docker compose up -d db api` with no override) to restore the `:3000` default.

Then run the suite:

```bash
pnpm test:e2e
```

The frontend dev server is started automatically (on a dedicated port, separate from
your normal `pnpm dev`, so the two don't collide). If the backend isn't reachable,
the suite fails immediately with a clear message rather than letting every test time
out mysteriously.

## How login works in tests

This suite runs the api container with `NODE_ENV=development` (see `docker-compose.yml`),
so the `POST /auth/magic-link` response includes a `devToken` field (see
`server/src/routes/auth.routes.ts`) — a convenience so nobody has to go dig the link
out of an email/console by hand outside production. `LoginForm.tsx` auto-verifies with
it immediately, so `helpers/auth.ts`'s `loginAs` just waits for the authenticated map
view rather than reading a link out of `docker compose logs api` or clicking one.

The suite still runs as a single worker (`workers: 1` in `playwright.config.ts`) —
tests share the same persistent Postgres instance and, in several specs, the same
seeded leader account, so running them concurrently isn't safe without further
per-test data isolation.

## Test data

The backend Postgres is persistent (a named Docker volume, not wiped between runs),
so tests generate unique emails/names per run (`helpers/test-data.ts`) rather than
assuming a clean slate, and assert on specific generated data rather than absolute
counts.

## Environment variables

- `E2E_API_URL` — defaults to `http://localhost:4000`.
- `E2E_SEED_LEADER_EMAIL` — defaults to `leader@example.com`; set this if you seeded
  a different email.
