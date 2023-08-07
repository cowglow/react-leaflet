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
import { LayerGroup, Polygon } from "react-leaflet";

type MarkerType = "default" | "custom"
type MarkerMode = "single" | "poly"

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
  const [markerType, setMarkerType] = useState<MarkerType>("default");
  const [markerMode, setMarkerMode] = useState<MarkerMode>("single");
  const [points, addPoint] = useState<L.LatLng[]>([]);
  const [polygons, setPolygons] = useState<L.LatLng[][]>([[]]);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const position = new L.LatLng(event.latlng.lat, event.latlng.lng);
    if (markerType === "default") {
      addMarker(position);
    }
    if (markerType === "custom") {
      addPoint((prevState) => [...prevState, position]);
    }
    if (markerMode === "poly") {
      setPolygons(prevState => {
        return prevState.map((polygon, index) =>
          index === prevState.length - 1 ? [...polygon, position] : polygon
        );
      });
    }
  };

  const markerRemover = (event) => {
    removeMarker(event);
    removePolygonPoint(event);
  };
  const removePoint = (event) => {
    addPoint((prevState) => removeFromCollection(event, prevState));
    removePolygonPoint(event);
  };
  const removePolygonPoint = (event) => {
    setPolygons(prevState => prevState.map(polygon => removeFromCollection(event, polygon)));
  };

  const fetchRandomLocations = async () => {
    const data = await getRandomCoordinates();

    if (markerType === "default") {
      data.forEach(item => addMarker(item));
      return;
    }

    data.forEach(item => addPoint(prevState => [...prevState, item]));
  };

  const initializePoly = () => {
    if (markerMode === "poly") {
      setPolygons(prevState => [...prevState, []]);
    }
  };

  const toggleMarkerType = (markerType: MarkerType) => {
    setMarkerType(markerType);
    initializePoly();
  };

  const togglePolyCapture = (polyCapture: MarkerMode) => {
    setMarkerMode(polyCapture);
    initializePoly();
  };

  const preStyle = { color: "white", fontSize: "1.235em" };
  return (
    <MainLayout>
      <StyledController>
        <div>
          <h3>Marker Type</h3>
          <button onClick={() => toggleMarkerType("default")} disabled={markerType === "default"}>Default</button>
          &nbsp;
          <button onClick={() => toggleMarkerType("custom")} disabled={markerType === "custom"}>Custom</button>
          <pre style={preStyle}>{JSON.stringify({ markerType })}</pre>
        </div>
        <div>
          <h3>Marker Mode</h3>
          <button onClick={() => togglePolyCapture("single")} disabled={markerMode === "single"}>Marker</button>
          &nbsp;
          <button onClick={() => togglePolyCapture("poly")} disabled={markerMode === "poly"}>Polygon</button>
          <pre style={preStyle}>{JSON.stringify({ markerMode })}</pre>
        </div>
        {markerMode === "single" ? "Marker" : "Poly"}
        <pre style={{ color: "white", fontSize: "1.235em" }}>
          {JSON.stringify({ markers: markers.length, points: points.length, polygons: polygons.length }, null, 2)}
        </pre>
        <StyledButton onClick={fetchRandomLocations}>Fetch Random Locations</StyledButton>
      </StyledController>
      <Map position={nbgCenter} zoom={13} scrollWheelZoom={true}>
        <MapEvents onClick={handleMapClick} />
        <LayerGroup>
          {markers &&
            markers.map((marker, index) => (
              <MarkerDefault key={index} position={marker} remove={markerRemover} draggable={true} />))}
        </LayerGroup>
        <LayerGroup>
          {points &&
            points.map((marker, index) => (
              <MarkerPoint key={index} position={marker} remove={removePoint} draggable={true} />))}
        </LayerGroup>
        <LayerGroup>
          {polygons &&
            [polygons].map((points, index) => {
              if (points.length > 0) {
                return (<Polygon key={index} positions={points} />);
              }
            })}
        </LayerGroup>
      </Map>
    </MainLayout>
  );
}
