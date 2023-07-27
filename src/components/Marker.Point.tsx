import Marker from "./Marker.tsx";
import L from "leaflet";
import pointIcon from "../assets/markers/point/point-icon.png";
import pointIcon2x from "../assets/markers/point/point-icon-2x.png";
import pointIconShadow from "../assets/markers/point/point-shadow.png";

interface MarkerPointProps extends MapMarkerProps {
}

const customIcon = L.icon({
  iconUrl: pointIcon,
  iconRetinaUrl: pointIcon2x,
  shadowUrl: pointIconShadow,
  // iconSize: [60, 55],
  // shadowSize: [50, 64],
  // iconAnchor: [22, 94],
  // shadowAnchor: [4, 62],
  // popupAnchor: [-3, -76]
});


export default function MarkerPoint({children, events, position, remove, ...other}: MarkerPointProps) {
  return (
    <Marker class="MarkerIcon" data-test-id="Marker"
            events={events}
            position={position}
            remove={remove}
            icon={customIcon}
            alt={"MarkerIcon!!!"}
    >{children}</Marker>
  );
}