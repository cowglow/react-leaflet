import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapAttribution() {
  const { baseMaps, selectedBaseMap } = useTileServer();

  const map = useMap();
  useEffect(() => {
    map.addLayer(baseMaps[selectedBaseMap]);
  }, []);

  return null;
}
