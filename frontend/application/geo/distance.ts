import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

const EARTH_RADIUS_KM = 6371;

export function calculateDistance(pointA: GeoCoordinate, pointB: GeoCoordinate): number {
  const lat1 = pointA.lat * (Math.PI / 180);
  const lat2 = pointB.lat * (Math.PI / 180);
  const deltaLat = (pointB.lat - pointA.lat) * (Math.PI / 180);
  const deltaLon = (pointB.lng - pointA.lng) * (Math.PI / 180);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}
