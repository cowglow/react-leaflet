import { useMap } from "react-leaflet";
import { useMarkersContext } from "context/markers-context/markers-context-hook.ts";
import { useEffect } from "react";

interface MapBoundsProps {
  disableZoom: boolean;
}

export default function MapBounds({ disableZoom = false }: MapBoundsProps) {
  const { markers } = useMarkersContext();
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(markers);
    if (bounds.isValid() && !disableZoom) {
      map.fitBounds(bounds);
    }

  }, [markers]);

  return null;
}