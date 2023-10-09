import type { MapLayerGroupProps } from "feature/map/typing.ts";
import MapLayerGroup from "feature/map/Map.LayerGroup.tsx";

interface LayerGroupProps extends MapLayerGroupProps {
}

export default function LayerGroupDefault({ children }: LayerGroupProps) {
  return (
    <MapLayerGroup>{children}</MapLayerGroup>
  );
}