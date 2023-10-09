import type { MapLayerGroupProps } from "feature/map/typing.ts";
import LayerGroupDefault from "./LayerGroup.Default.tsx";
import MarkerDefault from "components/markers/Marker.Default.tsx";
import { Popup } from "react-leaflet";

interface LayerGroupMarkersProps extends MapLayerGroupProps {
  positions: L.LatLng[];
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
        ))
      }
    </LayerGroupDefault>
  );
}