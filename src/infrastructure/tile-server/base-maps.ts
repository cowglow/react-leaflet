import type { StyleSpecification } from "maplibre-gl";

// Raster XYZ tile sources. MapLibre does not expand Leaflet's `{s}` subdomain or
// `{r}` retina placeholders, so subdomains are listed explicitly and every URL is
// the plain (non-retina) variant.
export interface BaseMapSource {
  tiles: string[];
  attribution: string;
  maxZoom: number;
}

const OSM = "© OpenStreetMap contributors";

// Keys are persisted verbatim to localStorage (see tile-server.provider.tsx), so
// keep them stable across changes.
export const baseMaps = {
  OpenStreetMap: {
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    attribution: OSM,
    maxZoom: 19,
  },
  "HOT OSM": {
    tiles: [
      "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    ],
    attribution: `${OSM}, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France`,
    maxZoom: 19,
  },
  "Carto (Basemaps)": {
    tiles: [
      "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
      "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    ],
    attribution: `${OSM}, © CARTO`,
    maxZoom: 19,
  },
  "Open Street Map (Fr)": {
    tiles: [
      "https://a.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      "https://b.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    ],
    attribution: OSM,
    maxZoom: 19,
  },
  "Open Street Map (De)": {
    tiles: ["https://tile.openstreetmap.de/{z}/{x}/{y}.png"],
    attribution: OSM,
    maxZoom: 19,
  },
  "Memo Maps": {
    tiles: ["https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"],
    attribution: OSM,
    maxZoom: 18,
  },
  "Open Top Map": {
    tiles: [
      "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
      "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
      "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
    ],
    attribution: `${OSM}, SRTM | © OpenTopoMap (CC-BY-SA)`,
    maxZoom: 17,
  },
  "Stadia Maps": {
    tiles: ["https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"],
    attribution: `© Stadia Maps, © OpenMapTiles, ${OSM}`,
    maxZoom: 20,
  },
} satisfies Record<string, BaseMapSource>;

export type BaseMapName = keyof typeof baseMaps;

export const defaultBaseMapName: BaseMapName = "OpenStreetMap";

// A minimal MapLibre style that renders a single raster basemap. This is the
// vector-first engine's equivalent of a Leaflet `L.tileLayer`.
export function rasterStyle(source: BaseMapSource): StyleSpecification {
  return {
    version: 8,
    sources: {
      basemap: {
        type: "raster",
        tiles: source.tiles,
        tileSize: 256,
        maxzoom: source.maxZoom,
        attribution: source.attribution,
      },
    },
    layers: [{ id: "basemap", type: "raster", source: "basemap" }],
  };
}
