import MapMarker from "ports/components/map/Map.Marker.tsx";
import type { MapMarkerProps } from "ports/components/map/map.types.ts";
import L from "leaflet";
import pointIcon from "assets/markers/point/point-icon.png";
import pointIcon2x from "assets/markers/point/point-icon-2x.png";
import pointIconShadow from "assets/markers/point/point-shadow.png";

interface MarkerPointProps extends MapMarkerProps {
  id?: string;
}

export default function MarkerPoint({
  children,
  events,
  position,
  remove,
}: MarkerPointProps) {
  const customIcon = L.icon({
    iconUrl: pointIcon,
    iconRetinaUrl: pointIcon2x,
    shadowUrl: pointIconShadow,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
  });

  return (
    <MapMarker
      events={events}
      position={position}
      remove={remove}
      icon={customIcon}
      alt={"MarkerIcon!!!"}
    >
      {children}
    </MapMarker>
  );
}
