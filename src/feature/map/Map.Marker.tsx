import { Marker } from "react-leaflet";

export default function MapMarker({ events, position, remove, ...other }: MapMarkerProps) {
  let eventHandlers: L.LeafletEventHandlerFnMap = {
    click: () => remove(position)
  };

  if (events) {
    eventHandlers = events;
  }

  return (
    <Marker {...other} position={position} {...{ eventHandlers }} />
  );
}
