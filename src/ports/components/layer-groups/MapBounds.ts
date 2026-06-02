import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getMarkers } from "infrastructure/redux/marker/marker.selectors.ts";

interface MapBoundsProps {
  disableZoom: boolean;
}

export default function MapBounds({ disableZoom = false }: MapBoundsProps) {
  const markers = useSelector(getMarkers);
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds(markers);
    if (bounds.isValid() && !disableZoom && markers.length > 5) {
      map.fitBounds(bounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  return null;
}