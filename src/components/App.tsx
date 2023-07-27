import L from "leaflet";
import MainLayout from "./layout/Main.tsx";
import Map from "../feature/map/Map.tsx";
import MapEvents from "../feature/map/Map.Events.tsx";
import { useMarkers } from "../hooks/use-markers.ts";
import styled from "styled-components";
import { useState } from "react";
import Marker from "./Marker.tsx";
import MarkerPoint from "./Marker.Point.tsx";

type MapEditMode = "marker" | "poly";

const StyledController = styled("div")`
  padding: 1.235em;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  background-color: #333333;
`;

export default function App() {
  const { markers, addMarker, removeMarker } = useMarkers();
  const [editMode, setEditMode] = useState<MapEditMode>("poly");
  const [points, addPoint] = useState<L.LatLng[]>([]);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    if (editMode === "marker") {
      addMarker(event)
    }
    if (editMode === "poly") {
      addPoint((prevState) => [
        ...prevState,
        new L.LatLng(event.latlng.lat, event.latlng.lng)
      ]);
    }
  };

  const removePoint = (event) => {
    console.log("Remove Point: ", { event });
  };

  return (
    <MainLayout>
      <StyledController>

        <button onClick={() => setEditMode("marker")} disabled={editMode === "marker"}>Marker</button>
        <button onClick={() => setEditMode("poly")} disabled={editMode === "poly"}>Poly</button>
        <pre style={{ color: "white", fontSize: "1.235em" }}>{JSON.stringify({ editMode, points: points.length, markers: markers.length })}</pre>
      </StyledController>
      <Map position={nbgCenter} zoom={13} scrollWheelZoom={true}>
        <MapEvents onClick={handleMapClick} />
        {markers &&
          markers.map((marker, index) => (
            <Marker key={index} position={marker} remove={removeMarker} draggable={true} />
          ))}
        {points &&
          points.map((marker, index) => (
            <MarkerPoint key={index} position={marker} remove={removePoint} draggable={true} />
          ))}
      </Map>
    </MainLayout>
  );
}
