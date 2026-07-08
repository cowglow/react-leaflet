# E2E tests

Real end-to-end tests — a headless browser driving the actual frontend against the
actual backend (Postgres + API), not mocks. Complements the unit tests under `src/`
and `server/src/`, which don't exercise the browser, network, or database at all.

## Prerequisites

This suite deliberately does not manage the backend itself. Before running it, bring
up the docker-compose stack, migrated and seeded (same steps as
`docs/HETZNER_DEPLOY.md`):

```bash
docker compose up -d db api
docker compose exec api pnpm prisma:deploy
docker compose exec api sh -c "SEED_LEADER_EMAIL=leader@example.com pnpm seed"
```

Then run the suite:

```bash
pnpm test:e2e
```

The frontend dev server is started automatically (on a dedicated port, separate from
your normal `pnpm dev`, so the two don't collide). If the backend isn't reachable,
the suite fails immediately with a clear message rather than letting every test time
out mysteriously.

## How login works in tests

There's no real email provider wired up yet (see `docs/PHASE_3_REPORT.md`), so magic
links are only ever logged to the API's own console. `helpers/magic-link.ts` reads
them out of `docker compose logs api`. This means:

- Tests must run against the docker-compose stack specifically (not some other way
  of running the API) — that's how login tokens get retrieved.
- The suite runs as a single worker (`workers: 1` in `playwright.config.ts`):
  concurrent tests requesting a magic link for the same email would race each other
  reading "the most recently logged token," so everything runs sequentially.

## Test data

The backend Postgres is persistent (a named Docker volume, not wiped between runs),
so tests generate unique emails/names per run (`helpers/test-data.ts`) rather than
assuming a clean slate, and assert on specific generated data rather than absolute
counts.

## Environment variables

- `E2E_API_URL` — defaults to `http://localhost:4000`.
- `E2E_SEED_LEADER_EMAIL` — defaults to `leader@example.com`; set this if you seeded
  a different email.
