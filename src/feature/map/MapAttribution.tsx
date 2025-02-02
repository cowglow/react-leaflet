import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";
import { TileLayer, useMap } from "react-leaflet";
import type { TileLayerProps } from "react-leaflet/lib/TileLayer";
import { useEffect } from "react";

export default function MapAttribution() {
  const { baseMaps, selectedBaseMap } = useTileServer();

  const map = useMap();
  useEffect(() => {
    map.addLayer(baseMaps[selectedBaseMap]);
  }, []);

  return null;
}
