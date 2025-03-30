import { RootState } from "context/redux-store/store.ts";

export function getMarkers(state: RootState): L.LatLng[] {
  return state.markers.items;
}

export function isEnabled(state: RootState): boolean {
  return state.markers.enabled;
}
