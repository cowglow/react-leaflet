import MapMarker from "feature/map/Map.Marker.tsx";
import type { MapMarkerProps } from "feature/map/typing.ts";
import L from "leaflet";
import pointIcon from "assets/markers/point/point-icon.png";
import pointIcon2x from "assets/markers/point/point-icon-2x.png";
import pointIconShadow from "assets/markers/point/point-shadow.png";


interface MarkerPointProps extends MapMarkerProps {
}

export default function MarkerPoint({ children, events, position, remove }: MarkerPointProps) {

  const customIcon = L.icon({
    iconUrl: pointIcon,
    iconRetinaUrl: pointIcon2x,
    shadowUrl: pointIconShadow
    // iconSize: [60, 55],
    // shadowSize: [50, 64],
    // iconAnchor: [22, 94],
    // shadowAnchor: [4, 62],
    // popupAnchor: [-3, -76]
  });

  return (
    <MapMarker
      children={children}
      events={events}
      position={position}
      remove={remove}
      icon={customIcon}
      alt={"MarkerIcon!!!"} />
  );
}

