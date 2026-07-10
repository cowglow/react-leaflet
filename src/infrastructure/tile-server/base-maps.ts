// Leaflet tile layer instances are stateful (each tracks the single map it's attached
// to), so they can't safely be shared across more than one live Leaflet map at a time.
// The real app only ever has one map, so a module-level singleton set (`baseMaps`
// below) is fine there — but Storybook mounts a fresh MapContainer per story, and
// reusing the same layer instances across those would corrupt Leaflet's internal
// bookkeeping. `createBaseMaps` lets each consumer that needs its own map (Storybook's
// preview decorators) mint its own independent set instead.
export function createBaseMaps() {
  return {
    OpenStreetMap: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }),
    "HOT OSM": L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
    }),
    "Carto (Basemaps)": L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      },
    ),
    "Open Street Map (Fr)": L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }),
    "Open Street Map (De)": L.tileLayer("https://tile.openstreetmap.de/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }),
    "Memo Maps": L.tileLayer("https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }),
    "Open Top Map": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }),
    "Stadia Maps": L.tileLayer("https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }),
  } as const;
}

export const baseMaps = createBaseMaps();
