import type { LeafletMouseEvent } from "leaflet";
import L from "leaflet";
import MainLayout from "./layout/Main.tsx";
import Map from "./Map.tsx";
import MapMarkers from "./Map.Markers.tsx";
import MapMarker from "./Map.Marker.tsx";
import { useMarkers } from "../hooks/use-markers.ts";
import styled from "styled-components";
import { useState } from "react";
import MapPoint from "./Map.Point.tsx";

type MapEditMode = "marker" | "poly";

const StyledController = styled("div")`
  padding: 0 4rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background-color: red;
`;

export default function App() {
  const { markers, addMarker, removeMarker } = useMarkers();
  const [editMode, setEditMode] = useState<MapEditMode>("marker");
  const [points, addPoint] = useState<L.LatLng[]>([]);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const handleMapClick = (event: LeafletMouseEvent) => {
    if (editMode === "marker") {
      addMarker(event);
    }
    if (editMode === "poly") {
      addPoint((prevState) => [
        ...prevState,
        new L.LatLng(event.latlng.lat, event.latlng.lng),
      ]);
    }
  };

  const removePoint = (event: LeafletMouseEvent) => {
    console.log("Remove Point: ", { event });
  };

  return (
    <MainLayout>
      <StyledController>
        <button onClick={() => setEditMode("marker")}>Marker</button>
        <button onClick={() => setEditMode("poly")}>Poly</button>
      </StyledController>
      <Map position={nbgCenter} zoom={13} scrollWheelZoom={true}>
        <MapMarkers onClick={handleMapClick} />
        {markers &&
          markers.map((marker, index) => (
            <MapMarker key={index} position={marker} remove={removeMarker} />
          ))}
        {points &&
          points.map((marker, index) => (
            <MapPoint key={index} position={marker} remove={removePoint} />
          ))}
      </Map>
    </MainLayout>
  );
}
