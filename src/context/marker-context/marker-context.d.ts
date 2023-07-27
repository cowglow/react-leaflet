interface MarkerContextProps {
  markers: L.LatLng[];
}

type MarkersContextApi = {
  addMarker: (event: L.LeafletMouseEvent) => void;
  clearMarkers: () => void;
  removeMarker: (position: L.LatLng) => void;
} & MarkerContextProps;
