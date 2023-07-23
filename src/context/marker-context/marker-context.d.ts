interface MarkerContextProps {
  markers: L.LatLng[];
}

type MarkersContextApi = {
  addMarker: (event: LeafletMouseEvent) => void;
} & MarkerContextProps;
