import type { RootState } from "infrastructure/redux/store.ts";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

export function getMarkers(state: RootState): GeoCoordinate[] {
  return state.markers.items;
}

export function getFilteredMarkers(state: RootState): GeoCoordinate[] {
  return state.markers.items.slice(0, state.markers.filteredLimit);
}

export function isLoading(state: RootState): boolean {
  return state.markers.loading;
}