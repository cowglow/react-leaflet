import { LayerGroup } from "react-leaflet";
import type { MapLayerGroupProps } from "ports/components/map/map.types.ts";

export default function MapLayerGroup({ children }: MapLayerGroupProps) {
  return <LayerGroup>{children}</LayerGroup>;
}