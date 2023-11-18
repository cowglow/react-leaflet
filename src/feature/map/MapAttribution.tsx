import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";
import { TileLayer } from "react-leaflet";
import type { TileLayerProps } from "react-leaflet/lib/TileLayer";

export default function MapAttribution() {
  const { tileServer } = useTileServer();

  const tileLayerOptions: TileLayerProps = {
    attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
    url: tileServer.url
  };

  return (
    <TileLayer {...tileLayerOptions} />
  );
}
