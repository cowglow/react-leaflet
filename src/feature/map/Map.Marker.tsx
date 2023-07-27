import { Marker } from "react-leaflet";

export default function MapMarker({ children, position, remove, events, ...other }: MapMarkerProps) {
  let eventHandlers: L.LeafletEventHandlerFnMap = {
    click: () => remove(position)
  };

  if (events) {
    eventHandlers = events;
  }

  return (
    <Marker {...other} position={position} {...{ eventHandlers }}>
      {children}
    </Marker>
  );
}
