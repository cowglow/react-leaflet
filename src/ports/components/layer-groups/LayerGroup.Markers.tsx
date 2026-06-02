import type { MapLayerGroupProps } from "ports/components/map/map.types.ts";
import LayerGroupDefault from "ports/components/layer-groups/LayerGroup.Default.tsx";
import MarkerDefault from "ports/components/markers/Marker.Default.tsx";
import { Popup } from "react-leaflet";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

interface LayerGroupMarkersProps extends MapLayerGroupProps {
  positions: GeoCoordinate[];
}

export default function LayerGroupMarker({ children, positions }: LayerGroupMarkersProps) {
  return (
    <LayerGroupDefault>
      {positions &&
        positions.map((position, index) => (
          <MarkerDefault key={index} position={position} draggable={true}>
            <Popup>
              <pre>{JSON.stringify(position, null, 2)}</pre>
              {children}
            </Popup>
          </MarkerDefault>
        ))}
    </LayerGroupDefault>
  );
}