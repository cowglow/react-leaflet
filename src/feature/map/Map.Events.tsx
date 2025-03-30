import { useMapEvent } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

interface MapMarkersProps {
  enabled: boolean;
  onClick: (event: LeafletMouseEvent) => void;
}

export default function MapEvents({ enabled, onClick }: MapMarkersProps) {
  useMapEvent("click", (event) => enabled && onClick(event));
  return null;
}
