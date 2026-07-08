# Project Plan: Visual Directory

This document is the working plan for turning this map prototype into a real tool: a
visual directory where leadership can create members, assign them to organizations,
see where everyone lives on a map, and see how far members are from each other. It
covers three things that need to happen together: finishing the "Clear Architecture"
migration already underway, building the actual member/organization features, and
adding a real backend with accounts and an audit trail.

See `docs/CLEAR_ARCHITECTURE.md` for the architectural style being adopted, and
`CLAUDE.md` for a snapshot of the current (partially-migrated) codebase state.

## Vision

- Leaders create **members** and assign them to **organizations** (Region → Headquarter
  → Area → District, per `domain/shared/types.ts`).
- Each member has an address, which is geocoded to a `GeoCoordinate` and rendered as a
  map marker.
- From any member (or your own location), you can see the distance to every other
  member — either as a sorted list or as radius rings on the map.
- Members carry a signup date and an active/lost-contact status: a member is `active`
  by default; a leader can explicitly mark someone as having lost contact, which stamps
  the date they were last known to be active.
- This starts as a leadership-only tool, is gradually opened up to technically
  comfortable members, and may never be used directly by less technical/older members —
  the UI needs to stay simple enough that this isn't a blocker.

## Decisions made and why

These came out of discussion and are recorded here so they don't get re-litigated:

- **Accounts**: every member can eventually have a login, but roles gate what they can
  do — `member` = read-only, `leader` = read + write. Not everyone needs to log in on
  day one; leaders first.
- **Visibility**: any logged-in member sees the full directory (address + contact info),
  not a redacted view. The access boundary is *editing*, not *viewing* — this is a
  trust-based tool for one organization, not a multi-tenant product.
- **Lost contact**: manual only. A leader explicitly flags a member as lost contact,
  which stamps the last-known-active date. No automatic inactivity timer for now.
- **Distance feature**: select a member (or use your own location) and see distance to
  everyone else. Not a full pairwise matrix — not enough value for the added UI/compute
  cost at this roster size.
- **Persistence**: a small hand-written REST API in front of a self-managed Postgres
  instance. Explicitly **not** Hasura — Hasura's value is auto-generated CRUD via
  GraphQL (REST is a thin wrapper over that), but the audit log below needs to be
  hand-written and atomic with each write anyway, so a plain REST handler gives more
  direct control for about the same effort.
- **Audit trail**: an application-level, append-only, hash-chained change log (each
  entry stores `hash = sha256(prevHash + canonical(entry))`), not a real blockchain —
  there's one trusted server, so consensus machinery would be pure overhead. This gives
  tamper-evidence and full who/when/what history without needing to reinvent Postgres
  as an event store.
- **Auth mechanism**: magic-link email login (click a link, no password). Chosen over
  passkeys for now because it's simpler to explain to less technical/older members and
  doesn't depend on device biometric support; doesn't require Keycloak or any IdP.
- **Hosting**: Hetzner (Bavaria-headquartered, EU datacenters), self-managed Postgres —
  not Azure/AWS (data sovereignty preference), not a managed Postgres SaaS (keeps
  infra to one VPS you fully control).
- **Dev/deploy shape**: the frontend stays a static site (unchanged Vite dev server via
  `pnpm dev`, unchanged GitHub Pages deploy via `.github/workflows/deploy.yml`) and only
  ever talks to the backend over its REST API (via a configurable base URL) — never to
  Postgres directly. The backend (API + Postgres) is containerized via `docker-compose`
  for local/Hetzner parity. This preserves the current separation between the static
  client and the data layer.

## Current state (baseline this plan builds on)

- The Clear Architecture migration is in progress: `domain/`, `application/`,
  `infrastructure/`, `ports/` are the live tree; `components/`, `context/`, `hooks/`,
  `redux-store/`, `utils/`, `db/`, `feature/`, `types/` are dead leftovers from before
  the migration (confirmed via import graph — nothing in the live tree references them).
- `domain/member` and `domain/organization` already have real types and factories
  (`member.factory.ts`, `organization.factory.ts`), but they're **not wired to
  anything**: `infrastructure/redux/member/member.slice.ts` and
  `.../organization/organization.slice.ts` are legacy-style stub reducers not even
  included in the root reducer (`infrastructure/redux/store.ts` only combines
  `markers` and `gyroscope`). `MemberForm`/`OrganizationForm` are placeholder
  components with no real fields.
- The map currently only ever renders anonymous `GeoCoordinate` pins added by clicking
  the map (`marker.slice.ts` / `marker.saga.ts`) — there's no concept of a Member marker
  yet.
- File → Open/Save currently round-trips those anonymous marker pins as CSV
  (`infrastructure/csv/csv.file.ts`), not member/organization records.
- There's dead MongoDB stub code (`infrastructure/persistence/db.client.ts` and
  `db.persistence.ts`, plus the older duplicate under `src/db/`) pointing at
  `mongodb://localhost:27017` — never called from anywhere. `docker-compose.yml` still
  has matching `mongodb`/`mongo-express` services left over from that abandoned idea.
- The "Edit" menu currently means "enable/disable click-to-add-marker" — this exists
  only because menu clicks bubble through to the map and were creating stray markers
  behind the floating control panel. The floating-panel-inside-the-map layout should
  stay; the real fix is stopping event propagation on the controls, not toggling
  marker creation on/off.
- The "Actions" menu is an empty placeholder for future actions. "View" only links out
  to external pages (system.css, GitHub repo) — no in-app views yet.
- `pnpm build` and `pnpm lint` are both currently broken (see `CLAUDE.md` for specifics)
  — fixing these is a prerequisite, not optional cleanup.

## Phase 0 — Stabilize

Prerequisite hygiene before building new features on top of a broken/duplicated tree.

- Fix `pnpm build` (missing `MapLayerGroupProps` export from `ports/components/map/map.types.ts`).
- Fix `pnpm lint`: point it at `src` instead of the stale `map-sector-creator` path, and
  migrate `.eslintrc.cjs` to a flat `eslint.config.js` (required by the installed
  ESLint v9).
- Finish the Clear Architecture migration: delete the dead legacy trees (`components/`,
  `context/`, `hooks/`, `redux-store/`, `utils/`, `db/`, `feature/`, `types/`) now that
  the new tree fully supersedes them. Move `src/config/` (still referenced from
  `ports/` for `menu.config.ts` / `dialog.config.tsx`) into the new tree, e.g.
  `ports/config/`. Drop the unused near-duplicates (`createMenuConfig.ts`,
  `dialog-config.tsx`).
- Delete the dead MongoDB stub (`infrastructure/persistence/db.*`) — superseded by the
  Postgres plan in Phase 3.

## Phase 1 — Fix the interaction model

- Stop menu/control clicks from bubbling into the map's click-to-add-marker handler
  (`event.stopPropagation()` on the floating control panel, not a global on/off
  toggle). Keep the current floating-panel-inside-the-map layout.
- Once propagation is fixed, retire the "Enable/Disable Markers" Edit menu items —
  they were a workaround for the bug, not a real feature.
- Re-scope the "Edit" and "Actions" menus around real actions once the member/org data
  model lands in Phase 2 (e.g. "Add Member", "Add Organization", "Mark Lost Contact").

## Phase 2 — Member & Organization features (the actual directory)

- Extend `domain/member/member.types.ts` with a signup date and a status field, e.g.:
  ```ts
  type MemberStatus =
    | { kind: "active" }
    | { kind: "lost-contact"; lastActiveDate: string };
  ```
  (`active` needs no date; a date only appears once contact is lost — matching the
  original idea of "active" vs. a lost-contact timestamp.)
- Turn `infrastructure/redux/member/member.slice.ts` and
  `.../organization/organization.slice.ts` into real Redux Toolkit slices, combined
  into the root reducer in `infrastructure/redux/store.ts`.
- Build out `MemberForm`/`OrganizationForm` (currently placeholders) to actually create
  and edit members, assign them to organizations, and capture/geocode an address into
  a `GeoCoordinate`.
- Change map rendering so markers represent **members** (via their address) rather than
  anonymous clicked points. Decide what happens to free-form pin-dropping — most likely
  it becomes "create a member at this location" rather than a separate concept.
- Add the distance feature: select a member or use `use-geo-location.ts`, compute
  distance to every other member (add a haversine helper alongside the existing
  `application/geo/bearing.ts`), and show it as a sorted list and/or radius rings.
- Evolve File → Open/Save from raw marker CSV to member/organization data — useful as
  an import/export/offline mechanism even after the backend exists (Phase 3), not just
  an interim measure.

## Phase 3 — Backend: Postgres + REST API on Hetzner

- Schema: `members`, `organizations`, membership/assignment, `accounts` (login
  identities + role), `audit_log` (hash-chained).
- REST API (Node/Express or similar) with CRUD endpoints for members/organizations,
  enforcing `member` (read-only) vs `leader` (read/write) roles from the session.
- Every write appends an audit log entry: `{ timestamp, actorAccountId, entity,
  entityId, diff, prevHash, hash }`, where `hash = sha256(prevHash + canonicalJson(rest
  of entry))` — computed and stored atomically with the underlying write.
- Magic-link email auth: passwordless login, leader-issued invites to start (no open
  self-registration initially).
- Local dev parity: add `api` and `db` (Postgres) services to `docker-compose.yml`,
  replacing the stale `mongodb`/`mongo-express` services (an `adminer` service is a
  reasonable stand-in for `mongo-express`). The frontend keeps running via plain
  `pnpm dev` (not containerized) and points at the API via an env var
  (`VITE_API_URL` or similar) — `http://localhost:<port>` locally, the real Hetzner
  domain in production.
- Deployment: frontend deploy is unchanged (`.github/workflows/deploy.yml` → GitHub
  Pages). Backend deploy to the Hetzner VPS starts manual (`docker compose up` on the
  box); CI/CD for the backend is explicitly out of scope until the API itself exists.

## Phase 4 — Rollout

- Leaders get accounts first: they do the data entry, edits, and lost-contact flagging.
- Technical members introduced next, read-only by default.
- General/older members are not a requirement to onboard directly — the UI (map-first,
  OS-menu affordance) should stay simple enough that they *could*, but adoption isn't
  forced.

## Explicitly deferred (not blocking, revisit later)

- Automatic inactivity-based lost-contact detection (vs. the manual flagging above).
- Per-field or per-member visibility controls (vs. today's all-or-nothing by role).
- Members editing their own record.
- A full pairwise distance matrix.
- Passkey login (viable alternative to magic-link, revisit if magic-link email proves
  friction-prone).
- CI/CD automation for backend deploys to Hetzner.