import type { LatLng, LeafletEventHandlerFnMap, MarkerOptions } from "leaflet";
import MapMarker from "./Map.Marker.tsx";
import type { EventedProps } from "@react-leaflet/core";
import L from "leaflet";

interface MapPointProps extends MarkerOptions, EventedProps {
  position: LatLng;
  remove: (position: LatLng) => void;
  events?: LeafletEventHandlerFnMap;
}
export default function MapPoint(props: MapPointProps) {
  const customIcon = new L.Icon({
    iconUrl: "./point-icon.png",
    iconRetinaUrl: "./point-icon-2x.png",
    shadowUrl: "./point-shadow.png",
    // iconSize: [60, 55],
    // shadowSize: [50, 64],
    // iconAnchor: [22, 94],
    // shadowAnchor: [4, 62],
    // popupAnchor: [-3, -76],
  });
  console.log(customIcon);
  return <MapMarker {...props} icon={customIcon} />;
}
