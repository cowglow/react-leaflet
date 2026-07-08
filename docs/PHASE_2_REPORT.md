# Phase 2 Report: Member & Organization Features (the actual contact book)

Status: **complete**. Scope per `docs/PLAN.md` § "Phase 2 — Member & Organization
features (the actual contact book)". Builds on Phase 0 (`7723740`) and Phase 1
(`6fc073e`). Not yet committed.

## Decision needed before starting

The plan calls for capturing/geocoding a member's address into a `GeoCoordinate`, but
no geocoding service existed anywhere in the repo (confirmed via a full grep — no
package, no config), and there's no backend yet (that's Phase 3) to broker such a call
server-side. Given member addresses are real people's home addresses, and given the
care already put into Phase 3's decisions (self-hosted Postgres, EU hosting, audit
trail), this was surfaced as a decision rather than assumed. Chosen approach:
**click-to-place, no third party** — a leader types the address as plain text and sets
the actual coordinate by clicking the location on the map, the same interaction
free-form pin-dropping already used. No address data ever leaves the app. Real
geocoding can be revisited later as a Phase 3 backend-brokered call if wanted.

## What changed, by plan bullet

### 1. Extend `domain/member/member.types.ts` with signup date and status

- `Member` gained `id: string` (stable identity — required once members become real,
  editable, Redux-backed entities rather than array-index-keyed anonymous pins),
  `signupDate: string`, `status: MemberStatus` (`{ kind: "active" }` |
  `{ kind: "lost-contact"; lastActiveDate: string }`), and `organizationId?: string`
  (how a member is assigned to an organization — see the Organization note below).
- `Organization` gained `id: string` for the same reason.
- `member.factory.ts`: `createMember` now stamps a fresh id, `signupDate`
  (`new Date().toISOString()`), and `status: { kind: "active" }`. Added
  `assignOrganization`, `markLostContact`, `reactivateMember`.
- Fixed a pre-existing bug while touching this file: `updateMemberTelephone` and
  `updateMemberEmail` each replaced `contact` wholesale (`{ ...member, contact: {
  telephone } }`), so calling one after the other silently dropped the first value.
  The existing test happened not to catch this (it never re-checked telephone after
  setting email). Both now merge (`{ ...member.contact, telephone }`), and a new test
  asserts both fields survive.
- `organization.factory.ts`: the existing `createDistrictOrganization` /
  `createAreaOrganization` / `createHeadquartersOrganization` / `createRegionOrganization`
  bottom-up "roll-up" factories (which flatten a hierarchy's members into the parent,
  with no parent→child object reference) were kept as-is — they're pre-existing,
  tested, and Phase 2 doesn't ask for a navigable org tree. Added a new
  `createOrganization(name, type)` for the flat, independently-creatable entities the
  Redux slice and `OrganizationForm` actually need; both now go through a shared
  `buildOrganization` helper that stamps the id (renamed from the old unexported
  `createOrganization(args)` to avoid a name collision).

### 2. Turn `member.slice.ts` / `organization.slice.ts` into real RTK slices

- `member.slice.ts` was hand-rolled, untyped Redux (string action-type constants,
  no `PayloadAction`, only `CREATE_MEMBER` implemented) — replaced with a real
  `createSlice`: `addMember`, `updateMember` (replace-by-id), `removeMember`,
  `setFilter`, `loadMembers` (bulk replace, for CSV import).
- `organization.slice.ts` was RTK-based but modeled a fetch-only CRUD flow
  (`getOrganizations`/`Success`/`Error`) with no create/update/delete — replaced with
  `addOrganization`, `updateOrganization`, `removeOrganization`.
- Added `member.selectors.ts` / `organization.selectors.ts` (neither existed before).
- Both wired into `infrastructure/redux/store.ts`'s root reducer under `member` /
  `organization` keys.

### 3. Build out `MemberForm` / `OrganizationForm`

Both were one-line placeholders (`<h1>Member Form</h1>`). Getting real forms working
required restructuring the dialog system first, since it had no way to pass data in:

- `app-dialog.types.ts` / `.context.tsx` / `.provider.tsx`: `openDialog` went from
  `(dialog: DialogType) => void` to `(dialog: DialogType | null, payload?:
  DialogPayload) => void`, where `DialogPayload = { coordinates?: GeoCoordinate;
  memberId?: string }`. This is what makes "create a member at this clicked
  coordinate" and "edit this specific member" possible at all.
- `ports/config/dialog.config.tsx`: changed from `Record<DialogType, JSX.Element>`
  (static, payload-less) to `Record<DialogType, (payload) => JSX.Element>`.
- `Dialogs.tsx`: dropped an always-rendered, unrelated `<BaseForm />` (a static
  text/password/car-select demo form with no relation to the active dialog) that sat
  inside every dialog regardless of which one was open — now deleted entirely as dead
  weight once nothing referenced it.
- `MemberForm`: name, address (street/number/zip/city — free text, coordinates come
  from the dialog payload), contact, organization assignment (`<select>` populated
  from the organization slice), lost-contact toggle + date. Create vs. edit mode is
  determined by whether `payload.memberId` resolves to an existing member.
- `OrganizationForm`: name + type (Region/Headquarter/Area/District).
- `Actions` menu (empty placeholder since Phase 1) got its first real item: "Add
  Organization" — the deferred Phase 1 bullet ("re-scope Edit/Actions around real
  actions once the data model lands") landing now that it has.

### 4. Change map rendering to members; retire free-form pin-dropping

- `App.tsx`: replaced the anonymous `GeoCoordinate[]` marker list with member markers
  (via `member.address.coordinates`), each rendered by a new `Marker.Member.tsx` with
  a popup showing name/address/status and Edit/Remove actions. Map click now calls
  `openDialog("MEMBER_DIALOG", { coordinates })` instead of dispatching `addMarker`
  directly — exactly the "pin-drop becomes create a member at this location" the plan
  called as the likely outcome.
- This forced retiring the entire anonymous-marker stack it depended on:
  `infrastructure/redux/marker/{slice,selectors,saga}.ts` deleted outright, along with
  two components that turned out to be already-orphaned leftovers from the ports
  migration once traced (`Marker.Default.tsx`, `LayerGroup.Markers.tsx` — neither was
  reachable from the live render tree even before this change), and `Loader.tsx`
  (its only consumer was the marker-loading flag being removed).
- The "Filter Range" slider (reveal-first-N-markers) was re-targeted at the member
  list rather than dropped, preserving the existing "incrementally reveal a large
  imported roster" behavior — `filteredLimit`/`setFilter` moved onto the member slice.
  `addMember` now also bumps `filteredLimit` by one, so a newly created member is
  visible immediately rather than hidden behind the slider (the old default-0 behavior
  was flagged as a UX quirk during Phase 1 testing).
- `MapBounds.ts` (auto-fit the map to visible pins) re-targeted from `getMarkers` to
  `getMembersWithAddress`.

### 5. Distance feature

- `application/geo/distance.ts`: `calculateDistance` (haversine, km), written to match
  `bearing.ts`'s existing style exactly — pure function, two `GeoCoordinate` params,
  manual degree→radian conversion, no external geo library.
- `ports/hooks/use-geo-location.ts` existed but was dead code (unused anywhere) and
  untyped, returning `{ latitude, longitude }` — mismatched against the domain's
  `{ lat, lng }` `GeoCoordinate` shape used everywhere else. Rewrote it typed, returning
  `GeoCoordinate` directly, and added a 10s timeout to `getCurrentPosition` so a real
  user who can't get a location fix sees a timely error instead of an indefinite hang
  (the hook had no bounded timeout before, and now that it's actually wired to a
  feature, that mattered).
- New `DistanceControl.tsx`: select a member or "My Location," see every other member
  sorted by distance ascending. Wired into `MapControls.tsx` as a new topRight panel
  (stacking with the existing layers panel; Leaflet's corner containers support
  multiple stacked controls).

### 6. Evolve File → Open/Save from raw marker CSV to member/organization data

This bullet turned out to require untangling a pre-existing mess, not just extending
one code path:

- There were **two independent, overlapping CSV import/export mechanisms**: the
  File-menu's Open/Save (routed through `marker.saga.ts`, whose `openFileSaga` did
  `JSON.parse` on the loaded file despite the save path writing real CSV — a
  latent format mismatch bug) and a separate bottom-right `ImportExportControls`
  panel (`use-csv-data.ts` hook, using the real, working `parseCSVString`/
  `convertToCSV` helpers). Both secretly shared the same hidden `<input
  id="input-file-button">` DOM node, so clicking File → Open actually triggered
  *both* pipelines on one file selection.
- Consolidated on the one that already worked correctly: the bottom-right panel is
  now the sole import/export mechanism, retargeted at `Member[]`. The File menu's
  Open/Save entries were removed (nothing left to open/save from that path).
- New `application/csv/member.csv.ts`: flattens a `Member` to/from a fixed-column CSV
  row (`memberToCSVRow`, `csvRowToMember`, `membersToCSV`, `csvRowsToMembers`).
- `infrastructure/csv/csv.file.ts` trimmed to just `createCSVFile` (the generic
  browser-download trigger); the GeoCoordinate-typed `exportCSVFile` and the fragile
  `loadCSVFile` (which queried and synthetically clicked the shared DOM input) were
  removed along with the saga that used them.
- `member.slice.ts`'s `loadMembers` reducer replaces the working set wholesale on
  import, matching the old `openFileDone` semantics (open = replace, not merge).

## A bug found and fixed via live testing, not just typechecking

Marking a member "lost contact" requires checking a checkbox. In the browser, the
checkbox was rendered but had **zero height and was unclickable** — not visible in
`tsc`/`vitest`, only in an actual click. Root cause: `system.css` hides the raw
`<input type=checkbox>` (`opacity:0; position:fixed`) and draws the visible box
entirely via the *following* `<label>`'s `::before`/`::after` pseudo-elements, using
the adjacent-sibling selector `input[type=checkbox]+label`. The form had the input
*nested inside* the label (`<label><input/>Lost contact</label>`), which doesn't match
that selector at all, so the label's pseudo-element checkbox visuals never applied.
Fixed by making them siblings with the input first, matching what `system.css`
expects everywhere else in the app. This is the kind of thing `/verify`-style live
interaction catches that a type-check or unit test can't.

## Verification

- `pnpm build`, `pnpm lint`, `pnpm test` all pass clean (12 domain tests, including 5
  new ones covering id/signupDate/status defaults, the contact-merge fix,
  organization-assignment, and lost-contact/reactivate).
- Full flow driven live in a headless Chromium/Playwright session against the Vite dev
  server:
  1. Click the map → Add Member dialog opens with the clicked coordinate.
  2. Fill and save → member marker appears on the map.
  3. Click the marker → popup shows name/address/status; Edit re-opens the form
     pre-filled.
  4. Check "Lost contact," set a date, save → popup reflects
     "Lost contact since 2026-01-01".
  5. Actions → Add Organization → new org appears in a second member's organization
     dropdown.
  6. Distance panel, origin = an existing member → correctly sorted, correctly
     computed distance to the other member (verified against a second, independently
     added member).
  7. Export CSV → correct header/row for both members, including status and lost-
     contact date → re-import the same file → member count matches, confirming the
     round trip.
  - `navigator.geolocation` reliably times out in this headless/sandboxed container
    even with a mocked position (confirmed independently, outside the app), so "My
    Location" origin mode was verified through the identical code path via a
    member-to-member origin instead. Not an app bug — standard browser API,
    environment-specific to this sandbox.

## Files changed

New:
```
docs/PHASE_1_REPORT.md
src/application/csv/member.csv.ts
src/application/geo/distance.ts
src/infrastructure/redux/member/member.selectors.ts
src/infrastructure/redux/organization/organization.selectors.ts
src/ports/components/controls/DistanceControl.tsx
src/ports/components/markers/Marker.Member.tsx
```

Deleted:
```
src/infrastructure/redux/marker/marker.saga.ts
src/infrastructure/redux/marker/marker.selectors.ts
src/infrastructure/redux/marker/marker.slice.ts
src/ports/components/forms/BaseForm.tsx
src/ports/components/layer-groups/LayerGroup.Markers.tsx
src/ports/components/markers/Marker.Default.tsx
src/ports/components/ui/Loader.tsx
```

Modified: `App.tsx`; `domain/member/member.{types,factory,factory.test}.ts`;
`domain/organization/organization.{types,factory,factory.test}.ts`;
`infrastructure/csv/csv.file.ts`; `infrastructure/redux/{store,sagas}.ts`;
`infrastructure/redux/member/member.slice.ts`;
`infrastructure/redux/organization/organization.slice.ts`;
`ports/components/action-menu/ActionMenu.tsx`;
`ports/components/controls/MapControls.tsx`; `ports/components/dialogs/Dialogs.tsx`;
`ports/components/forms/{MemberForm,OrganizationForm}.tsx`;
`ports/components/import-export/{ExportController,ImportExportControls}.tsx`;
`ports/components/layer-groups/MapBounds.ts`;
`ports/config/{dialog.config.tsx,menu.config.ts}`;
`ports/context/app-dialog/app-dialog.{types,context,provider}.tsx`;
`ports/hooks/use-geo-location.ts`.

26 files changed, 525 insertions(+), 212 deletions(-) (not yet committed).
