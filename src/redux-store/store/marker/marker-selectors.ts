import { RootState } from "redux-store/store.ts";

export function getMarkers(state: RootState): L.LatLng[] {
  return state.markers.items;
}

export function isEnabled(state: RootState): boolean {
  return state.markers.enabled;
}

export function isLoading(state: RootState): boolean {
  return state.markers.loading;
}
