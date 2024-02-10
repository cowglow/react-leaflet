import { useEffect, useState } from "react";
import L from "leaflet";
/**
 * The goal here is to remove the react-leaflet dependency
 * A wrapper class can also be created around L
 */
import { Polygon, Tooltip } from "react-leaflet";
// import styled from "styled-components";
import MainLayout from "components/layout/MainLayout.tsx";
import MarkerPoint from "components/markers/Marker.Point.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import Map from "feature/map/Map.tsx";
import MapEvents from "feature/map/Map.Events.tsx";
import { removeFromCollection } from "utils/filters.ts";
// import { useCoordinates } from "hooks/use-coordinates.ts";
import LayerGroupDefault from "components/layer-groups/LayerGroup.Default.tsx";
import LayerGroupMarker from "components/layer-groups/LayerGroup.Markers.tsx";
import { useTrackPoints } from "hooks/use-track-points.ts";
import LayerGroupTrackPoints from "components/layer-groups/LayerGroup.TrackPoints.tsx";
import MapBounds from "components/layer-groups/MapBounds.ts";

// const StyledController = styled("div")`
//   //padding: 1.235em;
//   display: flex;
//   //justify-content: flex-start;
//   gap: 1rem;
//   background-color: #333333;
// `;

// const StyledButton = styled("button")`
//   margin-left: auto;
// `;

export default function App() {
  const [marker, _setMarker] = useState<MarkerType>("DEFAULT");
  const [mode, _setMode] = useState<MarkerMode>("POINT");
  const { markers, addMarker } = useMarkers();
  // const { getRandomCoordinates } = useCoordinates();
  const { addTrackPoint } = useTrackPoints();

  const [points, addPoint] = useState<L.LatLng[]>([]);
  const [polygons, setPolygons] = useState<L.LatLng[][]>([[]]);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const position = new L.LatLng(event.latlng.lat, event.latlng.lng);

    if (mode === "POINT") {
      switch (marker) {
        case "AIRCRAFT":
          addTrackPoint(position);
          return;
        case "CUSTOM":
          addPoint((prevState) => [...prevState, position]);
          return;
        default:
          addMarker(position);
      }
    }

    if (mode === "POLYGON") {
      switch (marker) {
        case "CUSTOM":
          addPoint((prevState) => [...prevState, position]);
          break;
        default:
          addMarker(position);
          break;
      }

      setPolygons((prevState) => {
        return prevState.map((polygon, index) =>
          index === prevState.length - 1 ? [...polygon, position] : polygon,
        );
      });
    }
  };

  const removePoint = (event) => {
    addPoint((prevState) => removeFromCollection(event, prevState));
    removePolygonPoint(event);
  };
  const removePolygonPoint = (event) => {
    setPolygons((prevState) =>
      prevState.map((polygon) => removeFromCollection(event, polygon)),
    );
  };

  // const fetchRandomLocations = async () => {
  //   const data = await getRandomCoordinates();
  //
  //   data.forEach((item) => {
  //     if (marker === "CUSTOM") {
  //       addPoint((prevState) => [...prevState, item]);
  //     } else {
  //       addMarker(item);
  //     }
  //   });
  // };

  useEffect(() => {
    setPolygons((prevState) => [...prevState, []]);
  }, [mode, marker]);

  return (
    <MainLayout>
      {/*
      <StyledController>
        <div>
          <h3>Marker Type</h3>
          <button
            disabled={marker === "DEFAULT"}
            onClick={() => setMarker("DEFAULT")}
          >
            Default
          </button>
          &nbsp;
          <button
            disabled={marker === "CUSTOM"}
            onClick={() => setMarker("CUSTOM")}
          >
            Custom
          </button>
          &nbsp;
          <button
            disabled={marker === "AIRCRAFT"}
            onClick={() => setMarker("AIRCRAFT")}
          >
            Aircraft
          </button>
        </div>
        <div>
          <h3>Marker Mode</h3>
          <button disabled={mode === "POINT"} onClick={() => setMode("POINT")}>
            Marker
          </button>
          &nbsp;
          <button
            disabled={mode === "POLYGON"}
            onClick={() => setMode("POLYGON")}
          >
            Polygon
          </button>
        </div>
        <pre style={{ color: "white", fontSize: "1.235em" }}>
          {JSON.stringify(
            {
              markers: markers.length,
              points: points.length,
              polygons: polygons.length,
            },
            null,
            2,
          )}
        </pre>
        <StyledButton
          onClick={fetchRandomLocations}
          disabled={marker === "AIRCRAFT"}
        >
          Fetch Random Locations
        </StyledButton>
      </StyledController>
      */}
      <Map center={nbgCenter} zoom={3} scrollWheelZoom={true}>
        <MapBounds disableZoom={mode === "POLYGON"} />
        <MapEvents onClick={handleMapClick} />
        <LayerGroupMarker positions={markers}>
          <>
            A pretty CSS3 popup. <br /> Easily customizable.
          </>
        </LayerGroupMarker>
        <LayerGroupDefault>
          {points &&
            points.map((marker, index) => (
              <MarkerPoint
                key={index}
                position={marker}
                remove={removePoint}
                draggable={true}
              >
                <Tooltip>
                  A Tooltip. <br /> Easily customizable.
                </Tooltip>
              </MarkerPoint>
            ))}
        </LayerGroupDefault>
        <LayerGroupDefault>
          {polygons &&
            [polygons].map((points, index) => {
              if (points.length > 0) {
                return <Polygon key={index} positions={points} />;
              }
            })}
        </LayerGroupDefault>
        <LayerGroupTrackPoints />
      </Map>
    </MainLayout>
  );
}
