import type { MapMarkerProps } from "ports/components/map/map.types.ts";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

// Strips a trailing slash so this can't produce "//aircraft-icon.svg" — a leading
// "//" is a protocol-relative URL, which browsers resolve against a host literally
// named "aircraft-icon.svg" instead of a path on the current origin. BASE_URL is
// "/" in Storybook and "/visual-directory" (no trailing slash) in the app itself.
function markerIconUrl(name: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${name}.svg`;
}

interface AircraftMarkerProps extends MapMarkerProps {
  bearing?: number;
}

export default function AircraftMarker({
  bearing = 45,
  position,
  alt = "Aircraft",
}: AircraftMarkerProps) {
  const map = useMap();
  const fixedBearing = bearing.toFixed(4);

  const iconHtml = (element: string) => `<div>${element}</div>`;

  const aircraftIcon = L.divIcon({
    className: "aircraft-marker",
    html: iconHtml(
      `<img src="${markerIconUrl("aircraft-icon")}" style="transform: rotate(${bearing}deg)" alt="${fixedBearing}" />`,
    ),
    iconSize: new L.Point(24, 24),
  });

  useEffect(() => {
    if (map) {
      const marker = L.marker(position, { icon: aircraftIcon, alt });
      marker.bindTooltip(`${fixedBearing}&deg;`, { direction: "top" });
      map.addLayer(marker);

      return () => {
        map.removeLayer(marker);
      };
    }
  });

  return null;
}
