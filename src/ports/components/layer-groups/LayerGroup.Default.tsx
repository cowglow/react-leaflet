import MapLayerGroup from "ports/components/map/Map.LayerGroup.tsx";
import { PropsWithChildren } from "react";

export default function LayerGroupDefault({ children }: PropsWithChildren) {
  return <MapLayerGroup>{children}</MapLayerGroup>;
}