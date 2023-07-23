import { useMapEvent } from "react-leaflet/hooks";
import { LeafletMouseEvent } from "leaflet";

interface MapMarkersProps {
  onClick: (event: LeafletMouseEvent) => void;
}

export default function MapMarkers({ onClick }: MapMarkersProps) {
  useMapEvent("click", (event) => onClick(event));
  return null;
}
