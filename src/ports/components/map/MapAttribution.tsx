import { useTileServer } from "ports/context/tile-server/tile-server.hook.ts";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapAttribution() {
  const { baseMaps, selectedBaseMap } = useTileServer();
  const map = useMap();

  useEffect(() => {
    map.addLayer(baseMaps[selectedBaseMap]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}