export interface MapMarkerProps extends L.MarkerOptions, L.EventedProps {
  children?: React.ReactNode;
  events?: L.LeafletEventHandlerFnMap;
  position: L.LatLng;
  remove: (position: L.LatLng) => void;
}

export interface MapLayerGroupProps {
  children?: React.ReactNode;
}
