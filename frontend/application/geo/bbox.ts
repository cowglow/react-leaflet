import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

// [[west, south], [east, north]] — the shape MapLibre's `fitBounds` expects.
export type BBox = [[number, number], [number, number]];

export function bbox(coordinates: GeoCoordinate[]): BBox | null {
  if (coordinates.length === 0) {
    return null;
  }

  let west = Infinity;
  let south = Infinity;
  let east = -Infinity;
  let north = -Infinity;

  for (const { lat, lng } of coordinates) {
    west = Math.min(west, lng);
    east = Math.max(east, lng);
    south = Math.min(south, lat);
    north = Math.max(north, lat);
  }

  return [
    [west, south],
    [east, north],
  ];
}
