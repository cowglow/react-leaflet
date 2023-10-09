import type { MapMarkerProps } from "feature/map/typing.ts";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const { BASE_URL } = import.meta.env;

interface AircraftMarkerProps extends MapMarkerProps {
  bearing?: number;
}

export default function({ bearing = 45, position, alt = "Aircraft" }: AircraftMarkerProps) {
  const map = useMap();
  const fixedBearing = bearing.toFixed(4);

  const iconHtml = (element: string) => {
    return `<div>${element}</div>`;
  };

  const aircraftIcon = L.divIcon({
    className: "aircraft-marker",
    html: iconHtml(`<img src="${BASE_URL}/aircraft-icon.svg" style="transform: rotate(${bearing}deg)" alt="${fixedBearing}" />`),
    iconSize: new L.Point(24, 24)
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