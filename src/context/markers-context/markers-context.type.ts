interface MarkerContextProps {
  markers: L.LatLng[];
  enable: boolean;
}

export type MarkersContextApi = {
  addMarker: (position: L.LatLng) => void;
  clearMarkers: () => void;
  removeMarker: (position: L.LatLng) => void;
  setEnable: (enable: boolean) => void;
} & MarkerContextProps;
