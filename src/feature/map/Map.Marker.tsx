import { Marker } from "react-leaflet";
import { MapMarkerProps } from "./typing.ts";

export default function MapMarker(props: MapMarkerProps) {
  const { remove, position, events } = props;

  let eventHandlers: L.LeafletEventHandlerFnMap = {
    click: () => remove(position)
  };

  if (events) {
    eventHandlers = events;
  }

  return (
    <Marker {...props} {...{ eventHandlers }} />
  );
}
