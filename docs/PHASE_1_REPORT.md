# Phase 1 Report: Fix the Interaction Model

Status: **complete**. Scope per `docs/PLAN.md` § "Phase 1 — Fix the interaction model".
Commit: `6fc073e` (on top of Phase 0's `7723740`).

## Problem

The floating control panels (action menu, layer/import-export controls, filter +
zoom) are plain React children of react-leaflet's `MapContainer`, so they render as
real DOM descendants of the Leaflet map container — not portaled elsewhere. Because
they're hand-rolled `div`s (reusing Leaflet's `leaflet-control` CSS classes for
positioning) rather than real `L.Control` instances, they never got Leaflet's
built-in automatic click-propagation guard that real controls get for free. Clicks
on any panel bubbled up through the DOM to Leaflet's own map click listener, which
triggered the click-to-add-marker handler — dropping a stray marker behind whichever
panel the user was actually interacting with.

The pre-existing workaround was a Redux flag (`markers.enabled`, toggled via
`setEnabled`) that the "Edit" menu's "Enable Markers"/"Disable Markers" items and an
`onMouseEnter` handler on the action menu flipped on/off, plus two ad hoc
`L.DomEvent.disableClickPropagation` calls scattered in `MapControls.tsx` for two
specific elements. This masked the symptom for those two elements without fixing the
actual bubbling, and left an on/off toggle in the UI that only existed because of the
bug.

## Fix

**Root cause fix** — `src/ports/components/controls/LayerControlWrapper.tsx` is the
single wrapper every floating panel renders through (all four corner positions:
action menu, layer/import-export controls, filter+zoom). It now takes a ref on its
root `<div>` and calls `L.DomEvent.disableClickPropagation` on it once, in a
`useEffect` on mount:

```tsx
const containerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (containerRef.current) {
    L.DomEvent.disableClickPropagation(containerRef.current);
  }
}, []);
```

This sets Leaflet's internal `_leaflet_disable_click` flag on that DOM node, which
`L.Map._isClickDisabled` walks up from the click target through ancestors (stopping
at the map container) to check before dispatching a `click` event — the same
mechanism Leaflet's own `L.Control` base class relies on. One fix, covers every
panel, no per-element special-casing.

**Cleanup enabled by the fix** — with propagation genuinely stopped at the DOM level,
the entire `enabled`/`setEnabled` toggle became dead weight and was removed end to
end:
- `infrastructure/redux/marker/marker.slice.ts` — dropped the `enabled` field and
  `setEnabled` reducer/action.
- `infrastructure/redux/marker/marker.selectors.ts` — dropped the `isEnabled`
  selector.
- `ports/components/map/Map.Events.tsx` — `MapEvents` no longer takes an `enabled`
  prop; it calls `onClick` unconditionally on map click.
- `App.tsx` — no longer reads `isEnabled` or passes an `enabled` prop.
- `ports/components/action-menu/ActionMenu.tsx` — dropped the
  `onMouseEnter={() => dispatch(setEnabled(false))}` workaround.
- `ports/config/menu.config.ts` — removed the "Enable Markers"/"Disable Markers" Edit
  menu items (kept "Clear Markers").
- `ports/components/forms/MemberForm.tsx` — dropped a stray demo read of `isEnabled`
  that had nothing to do with the actual form (this file is still a placeholder,
  slated for real content in Phase 2).
- `ports/components/controls/MapControls.tsx` — removed the two now-redundant ad hoc
  `L.DomEvent.disableClickPropagation` calls (filter range input, filter toggle
  button), since the wrapper-level fix already covers their entire subtree.

The third Phase 1 bullet in the plan — re-scoping the "Edit"/"Actions" menus around
real actions (e.g. "Add Member", "Mark Lost Contact") — is explicitly deferred until
the member/org data model exists in Phase 2; nothing to do there yet.

## Verification

- `pnpm build`, `pnpm lint`, `pnpm test` all pass clean.
- Ran the app live: started the Vite dev server and drove it with a headless
  Chromium/Playwright script.
  - Clicking the "File" action-menu item, the "Filter Range" label, the "Disable"
    filter-toggle button, and the zoom "+" control were all checked against the
    *total* marker count in Redux state (read via the filter slider's `max`
    attribute, which is bound to `getMarkers` — a proxy that sidesteps the app's
    unrelated `filteredLimit` display quirk where newly added markers don't render
    until the filter slider is moved). Total stayed at `0` through all four control
    clicks.
  - A subsequent click on open map area (avoiding the existing own-position marker
    at the map's center) brought the total to `1`, confirming genuine map clicks
    still add a marker.
  - `console --errors`-equivalent check: no page errors, aside from a pre-existing
    unrelated Redux "selector returned a different result" warning and an expected
    `Geolocation error` in the headless/no-GPS test environment.

## Files changed

```
src/App.tsx
src/infrastructure/redux/marker/marker.selectors.ts
src/infrastructure/redux/marker/marker.slice.ts
src/ports/components/action-menu/ActionMenu.tsx
src/ports/components/controls/LayerControlWrapper.tsx
src/ports/components/controls/MapControls.tsx
src/ports/components/forms/MemberForm.tsx
src/ports/components/map/Map.Events.tsx
src/ports/config/menu.config.ts
```
9 files changed, 16 insertions(+), 40 deletions(-).
