import { LayerGroup } from "react-leaflet";
import type { MapLayerGroupProps } from "feature/map/typing.ts";

export default function MapLayerGroup({ children }: MapLayerGroupProps) {
  return (
    <LayerGroup>
      {children}
    </LayerGroup>
  );
}