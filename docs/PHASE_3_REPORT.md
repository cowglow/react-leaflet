# Phase 3 Report: Backend — Postgres + REST API

Status: **complete**. Scope per `docs/PLAN.md` § "Phase 3 — Backend: Postgres + REST
API on Hetzner". Builds on Phase 0 (`7723740`), Phase 1 (`6fc073e`), Phase 2
(`39a3700`). Not yet committed. Not deployed anywhere — that's explicitly manual,
later, per the plan's own deployment bullet.

## Decisions needed before starting

Three real technical decisions, each surfaced to the user rather than assumed, since
they affect a lot of downstream code:

1. **Database access**: Prisma (schema-first ORM), over raw `pg` or Drizzle.
2. **Magic-link email delivery**: a dev-only console-log stub for now — no email
   provider account exists to test real sending against anyway. Built behind a
   `Mailer` interface so swapping in a real provider later is a small, isolated change.
3. **Frontend scope**: also migrate the frontend's member/organization Redux state to
   call the new API in this same pass, rather than leaving that as separate follow-up
   work.

## What was built

### Backend (`server/`) — new, independent Node/TypeScript project

Not a pnpm workspace member of the frontend — genuinely separate deployables (static
site vs. containerized API), matching the plan's own separation. Own `package.json`,
lockfile, `tsconfig.json`.

- **Schema** (`prisma/schema.prisma`): `Account` (email, role, optional link to a
  `Member` for self-service accounts later), `Member`, `Organization`,
  `AuditLogEntry`, `MagicLinkToken`. Membership is `Member.organizationId` (a plain
  FK), not an embedded array — matching how the frontend's Redux-managed
  `Organization` already worked in Phase 2 (`createOrganization` defaults `members`
  to `[]`; the rollup-style hierarchy factories are a separate, untouched concern).
  Initial migration generated and committed under `prisma/migrations/`.
- **Auth** (`src/auth/`): magic-link request → `POST /auth/magic-link` (always
  responds identically whether or not the email has an account, to avoid enumeration)
  → looks up the `Account`, mints a random token, stores its SHA-256 hash with a
  15-minute expiry, and hands it to a `Mailer` interface (`consoleMailer` logs the
  full login URL). `POST /auth/verify` consumes the token (single-use, checked
  against expiry) and issues a 7-day JWT carrying `{accountId, email, role}`. Sessions
  are **stateless bearer JWTs**, not cookies — deliberately, to sidestep cross-origin
  `SameSite`/`Secure` cookie complications between the frontend (`:3001`, self-signed
  HTTPS via the existing `vite-plugin-basic-ssl`) and the API (`:4000`, plain HTTP in
  dev) without adding a reverse proxy just for local dev. `requireAuth`/`requireRole`
  middleware gate routes; `POST /auth/invite` (leader-only) is how new accounts get
  created — there's no open self-registration, matching the plan's "leader-issued
  invites" decision. A `prisma/seed.ts` script bootstraps the very first leader
  account from `SEED_LEADER_EMAIL`, solving the obvious chicken-and-egg problem
  (nobody can invite a leader before one exists).
- **Audit log** (`src/audit/audit-log.ts` + `src/lib/canonical-json.ts`):
  `appendAuditLog(tx, {actorAccountId, entity, entityId, diff})` fetches the latest
  entry (ordered by an auto-incrementing `sequence`, not `timestamp`, to avoid any
  clock-skew ambiguity about ordering), computes
  `hash = sha256(prevHash + canonicalJson({timestamp, actorAccountId, entity, entityId, diff}))`
  with a genesis `prevHash` of 64 zeros for the first-ever entry, and inserts it.
  Every member/organization write (`src/routes/members.routes.ts`,
  `organizations.routes.ts`) wraps its own write and the audit append in one
  `prisma.$transaction`, so they commit atomically together — an audit entry can
  never exist without the write it describes, or vice versa. `canonicalJson` sorts
  object keys recursively so semantically-identical diffs always hash the same way
  regardless of key insertion order; covered by 4 unit tests.
- **REST endpoints**: full CRUD for `/members` and `/organizations`. `GET` requires
  only `requireAuth` (any logged-in role sees the full directory — matches the plan's
  "the access boundary is editing, not viewing" decision); `POST`/`PUT`/`DELETE`
  additionally require `requireRole("leader")`. Response/request bodies are shaped to
  match the frontend's existing `domain/member/member.types.ts` /
  `domain/organization/organization.types.ts` nested shape directly (a
  `toApiMember`/`fromApiMember` mapping layer sits between that and Prisma's flat
  columns), specifically so the frontend's domain types, factories, and form logic
  from Phase 2 didn't need to change — only *how* data gets in and out of Redux
  changed.
- **Local dev parity** (`docker-compose.yml`): added `db` (`postgres:16`), `api`
  (builds `server/Dockerfile`, depends on `db`), and `adminer` services, per the
  plan's explicit mention of Adminer as the `mongo-express` replacement. The frontend
  (`react-leaflet` service) is unchanged and still runs via plain `pnpm dev`, not
  containerized, per the plan.

### Frontend

- `infrastructure/api/api-client.ts` + `token-storage.ts`: a thin `fetch` wrapper
  reading `VITE_API_URL`, attaching `Authorization: Bearer <jwt>` from `localStorage`
  when present.
- `infrastructure/redux/auth/`: new slice (`restoreSession`, `requestMagicLink`,
  `verifyMagicLink`, `logout`) and selectors (`getAccount`, `getRole`, `isLeader`).
  **`store.ts`'s middleware had `thunk: false`** (left over from before Redux
  Toolkit's async thunks were used anywhere in this codebase) — re-enabled, since
  `createAsyncThunk` doesn't work without it. This would have silently broken every
  new thunk if missed.
- `ports/components/auth/{LoginForm,AuthGate}.tsx`: `AuthGate` wraps the whole app
  (wired in `main.tsx`), checks the URL for a `?token=` query param on mount (the
  magic-link landing case — exchanges it via `verifyMagicLink` then strips it from the
  URL) or otherwise tries to restore an existing session from a stored JWT; renders
  `LoginForm` until authenticated.
- `member.slice.ts` / `organization.slice.ts`: rewritten from synchronous local-state
  reducers to `createAsyncThunk`s (`fetchMembers`, `addMember`, `updateMember`,
  `removeMember`, `fetchOrganizations`, `addOrganization`) calling the API. Kept the
  same action names as Phase 2's local-only versions so most call sites didn't need
  renaming — only needed to become `async`, `.unwrap()` the dispatch, and handle
  rejection (a plain `alert()` on failure; no toast/snackbar system exists yet to do
  better).
- `App.tsx` fetches members and organizations on mount now that they live server-side
  instead of starting pre-populated from local reducer state.
- **Role gating**: map-click-to-add-member, the marker popup's Edit/Remove buttons,
  and the Actions menu's "Add Organization" are all hidden/disabled for a `member`
  role account (`isLeader` selector). This is a UX nicety, not the real security
  boundary — the API independently rejects unauthorized writes with 403 regardless of
  what the client shows, which is the actual enforcement point.
- CSV import (`ImportExportControls.tsx`) now dispatches `addMember` per parsed row
  against the API instead of a local bulk-replace, since the backend is the real
  source of truth now; re-importing an already-imported file will (correctly) fail
  those rows on the id collision, reported via a simple count in an `alert()`.
- Fixed a small regression this phase itself introduced: `lastActiveDate` used to be
  stored as a plain `YYYY-MM-DD` string; once it round-trips through the API's
  `DateTime` column, it comes back as a full ISO timestamp. Both places that display
  or re-populate it (`Marker.Member.tsx`'s popup, `MemberForm.tsx`'s date input) now
  `.slice(0, 10)` it — found via live testing (the edit form's native date input
  silently rejects non-`YYYY-MM-DD` values), not by type-checking.
- `vitest.config.ts` was picking up `server/**/*.test.ts` too once the backend had its
  own tests, since nothing scoped it to `src/` — added `test.include: ["src/**/*.test.ts"]`
  so the frontend and backend test suites stay properly separate (they have
  independent dependencies and shouldn't run under each other's config).

## A sandbox-specific detour worth knowing about

Docker Hub image pulls (`docker pull postgres:16`, even `docker pull hello-world`)
hung indefinitely in this sandbox even after starting Docker Desktop — network egress
to the Docker registry appears blocked here, while the npm/pnpm registry is fine. To
still get a **real** live Postgres to develop and test against (not just typecheck
against), `server/scripts/dev-db.ts` boots `@electric-sql/pglite` (an embedded WASM
Postgres) behind `@electric-sql/pglite-socket`, exposing it as a genuine
`postgresql://` wire-protocol server on `127.0.0.1:5432` — Prisma connects to it
exactly as it would a real Postgres, no code differences. This is what every migration
apply, seed run, and the full end-to-end test below actually ran against.

This is a sandbox convenience, not part of the intended design — real local dev is
still meant to be `docker compose up` against a real `postgres:16` container per
`docker-compose.yml`, which is what got committed and is what should work on a normal
machine with working Docker Hub access. Two things to know if you keep it:
- It only accepts one connection at a time, so `DATABASE_URL` needed
  `?pgbouncer=true&connection_limit=1` (this disables Prisma's named prepared
  statements and caps its pool to one connection) to avoid a
  `prepared statement "s0" already exists` error — a compatibility quirk between
  Prisma and lightweight/pooled Postgres-wire servers, not a real Postgres issue.
  That query-string workaround lives only in the gitignored local `server/.env`, not
  in the committed `.env.example`.
- `docker-compose.yml`'s `db`/`api`/`adminer` services were validated with
  `docker compose config` (syntactically correct, resolves cleanly) but **not**
  actually run end-to-end in this sandbox, for the same registry-access reason. Worth
  a real `docker compose up` on a machine with normal Docker Hub access before
  relying on it.

## Verification

- `pnpm build`/`lint`/`test` clean on the frontend; `tsc --noEmit` and `vitest run`
  clean on the backend (4 unit tests for `canonicalJson`'s determinism).
- Full stack driven live end-to-end (PGlite-backed Postgres + the real Express API +
  the real Vite dev server, via headless Chromium/Playwright):
  1. Unauthenticated visit shows the login form.
  2. Request a magic link for the seeded leader → read the logged link from the
     server console → visit it → session established, map shown.
  3. As leader: click the map → Add Member dialog → save → marker appears. Edit via
     the popup, mark lost contact with a date → popup and re-opened form both show
     the plain date correctly (post-fix). Actions → Add Organization → succeeds.
  4. Invited a second, `member`-role account via `POST /auth/invite`, logged in as
     them: the same data is visible (read access confirmed), but the Actions menu is
     absent, the marker popup has no Edit/Remove buttons, and clicking the map does
     not open the create-member dialog (all three confirmed via DOM assertions, not
     just visually).
  5. Queried the audit log directly afterward: 3 entries (member create, member
     update, organization create), sequence-ordered, each `prevHash` exactly matching
     the previous entry's `hash`, first entry's `prevHash` the all-zero genesis value
     — chain verified programmatically, not just eyeballed.

## Files changed

New (`server/`, 25 files — schema, migration, seed, app, auth, audit, routes, and one
test file — plus its own `package.json`/lockfile/`tsconfig`/`Dockerfile`/`.gitignore`/
`.env.example`):
```
server/.env.example
server/.gitignore
server/Dockerfile
server/package.json
server/pnpm-lock.yaml
server/tsconfig.json
server/prisma/schema.prisma
server/prisma/seed.ts
server/prisma/migrations/20260704141037_init/migration.sql
server/prisma/migrations/migration_lock.toml
server/scripts/dev-db.ts
server/src/app.ts
server/src/index.ts
server/src/db/prisma.ts
server/src/lib/canonical-json.ts
server/src/lib/canonical-json.test.ts
server/src/audit/audit-log.ts
server/src/auth/jwt.ts
server/src/auth/magic-link.ts
server/src/auth/mailer.ts
server/src/auth/middleware.ts
server/src/routes/auth.routes.ts
server/src/routes/members.routes.ts
server/src/routes/organizations.routes.ts
```

New (frontend):
```
.env.example
src/infrastructure/api/api-client.ts
src/infrastructure/api/token-storage.ts
src/infrastructure/redux/auth/auth.slice.ts
src/infrastructure/redux/auth/auth.selectors.ts
src/ports/components/auth/LoginForm.tsx
src/ports/components/auth/AuthGate.tsx
```

Modified: `.gitignore`; `docker-compose.yml`; `src/App.tsx`; `src/main.tsx`;
`src/vite-env.d.ts`; `vitest.config.ts`;
`src/infrastructure/redux/{store,member/member.slice,organization/organization.slice}.ts`;
`src/ports/components/action-menu/ActionMenu.tsx`;
`src/ports/components/forms/{MemberForm,OrganizationForm}.tsx`;
`src/ports/components/import-export/ImportExportControls.tsx`;
`src/ports/components/markers/Marker.Member.tsx`; `src/ports/config/menu.config.ts`.

12 frontend files changed, 213 insertions(+), 77 deletions(-), plus the 25 new backend
files (not yet committed).
