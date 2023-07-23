import { LatLng } from "leaflet";
import { Marker } from "react-leaflet";

interface MapMarkerProps {
  position: LatLng;
}

export default function MapMarker({ position }: MapMarkerProps) {
  return <Marker position={position} />;
}
