import type { LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import MainLayout from "./layout/Main.tsx";
import Map from "./Map.tsx";
import MapMarkers from "./Map.Markers.tsx";
import MapMarker from "./Map.Marker.tsx";
import { useMarkers } from "../hooks/use-markers.ts";

type MapEditMode = "marker" | "poly";

export default function App() {
  const { markers, addMarker, removeMarker } = useMarkers();

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const editMode: MapEditMode = "marker";

  const handleMapClick = (event: LeafletMouseEvent) => {
    if (editMode === "marker") {
      addMarker(event);
    }
  };

  return (
    <MainLayout>
      <Map position={nbgCenter} zoom={13} scrollWheelZoom={true}>
        <MapMarkers onClick={handleMapClick} />
        {markers &&
          markers.map((marker, index) => (
            <MapMarker key={index} position={marker} remove={removeMarker} />
          ))}
      </Map>
    </MainLayout>
  );
}
