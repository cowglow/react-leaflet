import type { LatLng } from "leaflet";
import { Marker, Popup, Tooltip } from "react-leaflet";

interface MapMarkerProps {
  position: LatLng;
  remove: (position: LatLng) => void;
}

export default function MapMarker({ position, remove }: MapMarkerProps) {
  const eventHandlers = {
    click: () => remove(position),
  };

  return (
    <Marker position={position} {...{ eventHandlers }}>
      <Popup>Popup Text</Popup>
      <Tooltip>Tooltip</Tooltip>
    </Marker>
  );
}
