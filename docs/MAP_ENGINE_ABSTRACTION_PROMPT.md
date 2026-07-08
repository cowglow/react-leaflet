# Prompt: Design a map-engine-agnostic map & marker library

Use this document to kick off a **new, standalone project** (its own repo/package). It is
intentionally written so it does not depend on this codebase — treat any mention of
"the current app" purely as background motivation, not as a dependency or a file layout
to imitate.

## Problem

A React mapping app currently renders everything directly against one specific map
library (Leaflet, via react-leaflet). Every piece of map UI — the map container, tile
layer switching, layer groups, markers, marker popups, marker click/edit/remove actions,
map click/viewport events — is written straight against that library's API and React
bindings. Two consequences:

1. **The map engine can't be swapped.** Moving to Google Maps, Mapbox GL, or anything
   else would mean rewriting every component that touches the map, not just a
   configuration change.
2. **Marker behavior is entangled with rendering.** What a marker *is* (its position,
   icon/type, popup content, and the actions a user can take on it — edit, remove, etc.)
   is defined in the same component that knows how to draw it with a specific library's
   primitives (e.g. calling that library's icon/marker constructors directly).

## Goal

Design and implement a small library that cleanly separates **map/marker domain
concepts** from **rendering engine**, so:

- A map can be swapped from one engine to another by writing a new adapter, without
  touching any code that defines *what* markers/layers exist or *what* they do.
- Marker definitions (position, type, popup/label content, available actions) are plain
  data + callbacks — engine-agnostic, testable without rendering anything.
- At least two engines are supported end-to-end (a first adapter, e.g. Leaflet, plus a
  second — Mapbox GL, Google Maps, or even a trivial in-memory/test adapter — enough to
  prove the abstraction actually holds and isn't secretly Leaflet-shaped).

## Suggested shape (adjust as you design — this is a starting point, not a spec)

- **Domain layer** (no framework, no map-library imports):
  - `MarkerDefinition`: id, position (lat/lng), a marker *type* (open string or enum —
    the domain shouldn't need to know every concrete icon), popup/label content, and a
    set of named actions (e.g. `{ edit?: () => void; remove?: () => void }`) rather than
    hardcoded buttons.
  - `LayerGroupDefinition`, `TileProviderDefinition` (name + URL template + attribution +
    zoom bounds — engine-agnostic tile source description).
  - Map viewport concept (center, zoom, bounds) as plain data.
- **Adapter contract** (the interface every engine implementation must satisfy):
  - Render a map container given a viewport and a tile provider.
  - Render a set of `MarkerDefinition`s, translating the generic `type`/actions into
    that engine's icon/popup/event APIs.
  - Emit generic events (map click → lat/lng, marker click, viewport change) back up
    through the contract, not the underlying engine's event object types.
  - Support switching tile provider and marker set at runtime without unmounting the
    whole map.
- **Adapters**: one implementation of the contract per engine. Each adapter owns all
  direct imports of its underlying library — nothing outside the adapter should import
  Leaflet/Mapbox/Google Maps types directly.
- **React bindings**: a thin `<MapView engine={leafletAdapter} markers={...} .../>`-style
  component that consumes the contract, so app code never imports a specific engine.

## Non-goals

- Don't try to migrate any existing app onto this right now — this is a from-scratch
  design/reference-implementation exercise.
- Don't aim for feature parity with every capability of every possible map engine —
  cover the common surface (tiles, markers with actions, popups, click events, viewport
  control) well rather than everything shallowly.
- Redux/any particular state-management library shouldn't be a requirement of the
  contract itself — state management is the consuming app's concern.

## Suggested deliverables

1. The domain types + adapter contract (TypeScript interfaces), with unit tests that
   validate a fake/in-memory adapter against the contract (proves the contract is
   engine-agnostic, not accidentally Leaflet-shaped).
2. A real first adapter (Leaflet is a reasonable choice given it's what prompted this).
3. A second adapter — even a minimal one — specifically to stress-test that the
   abstraction holds up against a genuinely different underlying API.
4. A small example app or Storybook-style component gallery demonstrating: switching
   tile providers at runtime, rendering markers with click-triggered actions, and
   swapping the whole engine adapter with no changes to marker/tile definitions.

## Context clues worth preserving (from the app that prompted this)

- Markers seen in practice have distinct shapes: a person/member marker with a popup
  showing details and role-gated edit/remove actions, a moving vehicle marker with a
  heading/bearing-rotated icon, a generic point marker with a custom icon, and a
  "my current location" marker.
- Tile providers vary (multiple OpenStreetMap-style sources plus others) and are
  switched by the end user at runtime, persisted across sessions.
- Map click events are used to place new markers; marker click events open
  edit/detail UI.
