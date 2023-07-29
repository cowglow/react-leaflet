import { useState } from "react";
import L from "leaflet";
import styled from "styled-components";
import MainLayout from "components/layout/MainLayout.tsx";
import MarkerPoint from "components/Marker.Point.tsx";
import MarkerDefault from "components/Marker.Default.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import Map from "feature/map/Map.tsx";
import MapEvents from "feature/map/Map.Events.tsx";
import { removeFromCollection } from "utils/filters.ts";
import { useCoordinates } from "hooks/use-coordinates.ts";

type MapEditMode = "marker" | "poly" | "point";

const StyledController = styled("div")`
  padding: 1.235em;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  background-color: #333333;
`;

const StyledButton = styled("button")`
  margin-left: auto;
`;

export default function App() {
  const { markers, addMarker, removeMarker } = useMarkers();
  const { getRandomCoordinates } = useCoordinates();
  const [editMode, setEditMode] = useState<MapEditMode>("marker");
  const [points, addPoint] = useState<L.LatLng[]>([]);
  const [polygons, _setPolygons] = useState<L.LatLng[][]>([]);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const position = new L.LatLng(event.latlng.lat, event.latlng.lng);
    if (editMode === "marker") {
      addMarker(position);
    }
    if (editMode === "poly") {
      console.log("poly", polygons);
    }
    if (editMode === "point") {
      addPoint((prevState) => [...prevState, position]);
    }
  };

  const removePoint = (event) => {
    addPoint((prevState) => removeFromCollection(event, prevState));
  };

  const fetchRandomLocations = async () => {
    const data = await getRandomCoordinates();

    if (editMode === "marker") {
      data.forEach(item => addMarker(item));
      return;
    }

    data.forEach(item => addPoint(prevState => [...prevState, item]));
  };

  return (
    <MainLayout>
      <StyledController>
        <button onClick={() => setEditMode("marker")} disabled={editMode === "marker"}>Marker</button>
        <button onClick={() => setEditMode("point")} disabled={editMode === "point"}>Point</button>
        <button onClick={() => setEditMode("poly")} disabled>Polygon (Coming Soon)</button>
        <pre style={{ color: "white", fontSize: "1.235em" }}>{JSON.stringify({
          editMode,
          points: points.length,
          markers: markers.length
        })}</pre>
        <StyledButton onClick={fetchRandomLocations}>Fetch Random Locations</StyledButton>
      </StyledController>
      <Map position={nbgCenter} zoom={13} scrollWheelZoom={true}>
        <MapEvents onClick={handleMapClick} />
        {markers &&
          markers.map((marker, index) => (
            <MarkerDefault key={index} position={marker} remove={removeMarker} draggable={true} />
          ))}
        {points &&
          points.map((marker, index) => (
            <MarkerPoint key={index} position={marker} remove={removePoint} draggable={true} />
          ))}
      </Map>
    </MainLayout>
  );
}
