import { useState } from "react";
import L from "leaflet";
import { useReactiveVar } from "@apollo/client";
/**
 * The goal here is to remove the react-leaflet dependency
 * A wrapper class can also be created around L
 */
import { Polygon, Tooltip } from "react-leaflet";
import styled from "styled-components";
import MainLayout from "components/layout/MainLayout.tsx";
import MarkerPoint from "components/markers/Marker.Point.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import Map from "feature/map/Map.tsx";
import MapEvents from "feature/map/Map.Events.tsx";
import { removeFromCollection } from "utils/filters.ts";
import { useCoordinates } from "hooks/use-coordinates.ts";
import LayerGroupDefault from "components/layer-groups/LayerGroup.Default.tsx";
import LayerGroupMarker from "components/layer-groups/LayerGroup.Markers.tsx";
import { markerType } from "../cache/types/marker-type.ts";
import { markerMode } from "../cache/types/marker-mode.ts";
import { useTrackPoints } from "hooks/use-track-points.ts";
import LayerGroupTrackPoints from "components/layer-groups/LayerGroup.TrackPoints.tsx";


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
  const marker = useReactiveVar(markerType);
  const mode = useReactiveVar(markerMode);

  const { markers, addMarker } = useMarkers();
  const { getRandomCoordinates } = useCoordinates();
  const { addTrackPoint } = useTrackPoints();

  const [points, addPoint] = useState<L.LatLng[]>([]);
  const [polygons, setPolygons] = useState<L.LatLng[][]>([[]]);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const position = new L.LatLng(event.latlng.lat, event.latlng.lng);
    if (marker === "AIRCRAFT") {
      addTrackPoint(position);
    }
    if (marker === "DEFAULT") {
      addMarker(position);
    }
    if (marker === "CUSTOM") {
      addPoint((prevState) => [...prevState, position]);
    }
    if (mode === "POLYGON") {
      setPolygons(prevState => {
        return prevState.map((polygon, index) =>
          index === prevState.length - 1 ? [...polygon, position] : polygon
        );
      });
    }
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

    if (markerType()[0] === "DEFAULT") {
      data.forEach(item => addMarker(item));
      return;
    }

    data.forEach(item => addPoint(prevState => [...prevState, item]));
  };

  /*
  const initializePoly = () => {
    if (mode === "POLYGON") {
      setPolygons(prevState => [...prevState, []]);
    }
  };
  const toggleMarkerType = (markerType) => {
    markerType(markerType);
    initializePoly();
  };

  const togglePolyCapture = (polyCapture) => {
    markerMode(polyCapture);
    initializePoly();
  };
  */
  return (
    <MainLayout>
      <StyledController>
        <div>
          <h3>Marker Type</h3>
          <button disabled={marker === "DEFAULT"} onClick={() => markerType("DEFAULT")}>Default</button>
          &nbsp;
          <button disabled={marker === "CUSTOM"} onClick={() => markerType("CUSTOM")}>Custom</button>
          &nbsp;
          <button disabled={marker === "AIRCRAFT"} onClick={() => markerType("AIRCRAFT")}>Aircraft</button>
        </div>
        <div>
          <h3>Marker Mode</h3>
          <button disabled={mode === "POINT"} onClick={() => markerMode("POINT")}>Marker</button>
          &nbsp;
          <button disabled={mode === "POLYGON"} onClick={() => markerMode("POLYGON")}>Polygon</button>
        </div>
        <pre style={{ color: "white", fontSize: "1.235em" }}>
            {JSON.stringify({
              markers: markers.length,
              points: points.length,
              polygons: polygons.length
            }, null, 2)}
        </pre>
        <StyledButton onClick={fetchRandomLocations}>Fetch Random Locations</StyledButton>
      </StyledController>
      <Map center={nbgCenter} zoom={3} scrollWheelZoom={true}>
        <MapEvents onClick={handleMapClick} />
        <LayerGroupMarker positions={markers}>
          <>A pretty CSS3 popup. <br /> Easily customizable.</>
        </LayerGroupMarker>
        <LayerGroupDefault>
          {points &&
            points.map((marker, index) => (
              <MarkerPoint key={index} position={marker} remove={removePoint} draggable={true}>
                <Tooltip>A Tooltip. <br /> Easily customizable.</Tooltip>
              </MarkerPoint>
            ))
          }
        </LayerGroupDefault>
        <LayerGroupDefault>
          {polygons &&
            [polygons].map((points, index) => {
              if (points.length > 0) {
                return (<Polygon key={index} positions={points} />);
              }
            })
          }
        </LayerGroupDefault>
        <LayerGroupTrackPoints />
      </Map>
    </MainLayout>
  );
}
