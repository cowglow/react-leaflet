interface MarkerContextProps {
  markers: L.LatLng[];
}

type MarkersContextApi = {
  addMarker: (position: L.LatLng) => void;
  clearMarkers: () => void;
  removeMarker: (position: L.LatLng) => void;
} & MarkerContextProps;
