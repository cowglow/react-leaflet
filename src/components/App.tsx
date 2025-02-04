import L from "leaflet";
/**
 * The goal here is to remove the react-leaflet dependency
 * A wrapper class can also be created around L
 */
// import { Polygon, Tooltip } from "react-leaflet";
// import styled from "styled-components";
import MainLayout from "components/layout/MainLayout.tsx";
// import MarkerPoint from "components/markers/Marker.Point.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import Map from "feature/map/Map.tsx";
// import MapEvents from "feature/map/Map.Events.tsx";
// import { removeFromCollection } from "utils/filters.ts";
// import { useCoordinates } from "hooks/use-coordinates.ts";
// import LayerGroupDefault from "components/layer-groups/LayerGroup.Default.tsx";
import LayerGroupMarker from "components/layer-groups/LayerGroup.Markers.tsx";
// import { useTrackPoints } from "hooks/use-track-points.ts";
// import LayerGroupTrackPoints from "components/layer-groups/LayerGroup.TrackPoints.tsx";
import MapBounds from "components/layer-groups/MapBounds.ts";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "context/state/store.ts";
// import {
//   decrement,
//   increment,
//   incrementAsync,
//   incrementByAmount,
// } from "context/state/counter/counterSlice.ts";
import BaseMapsLayers from "components/base-map-layers/BaseMapsLayers.tsx";
import LayerControl from "components/layer-control/LayerControl.tsx";
import { ExportController, ImportController } from "feature/csv";
import { Box } from "@mui/material";
// import EditableList from "components/editable-list/EditableList.tsx";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { useTrackPoints } from "hooks/use-track-points.ts";
import ZoomControls from "components/zoom-controls/ZoomControls.tsx";

/*
const StyledContainer = styled("div")`
  border: thin solid red;
  padding: 1.235em;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  background-color: #cccccc;
`;
*/

/*
const StyledButton = styled("button")`
  min-width: 25%;
  //padding: 1px 3px;
  //margin-left: auto;
`;
*/

export default function App() {
  // const [marker, _setMarker] = useState<MarkerType>("DEFAULT");
  // const [mode, _setMode] = useState<MarkerMode>("POINT");
  const { markers, addMarker, clearMarkers } = useMarkers();
  const { clearTrackPoints } = useTrackPoints();
  // const { getRandomCoordinates } = useCoordinates();

  // const [points, addPoint] = useState<L.LatLng[]>([]);
  // const [polygons, setPolygons] = useState<L.LatLng[][]>([[]]);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    const position = new L.LatLng(event.latlng.lat, event.latlng.lng);
    addMarker(position);
    // if (mode === "POINT") {
    //   switch (marker) {
    //     case "AIRCRAFT":
    //       addTrackPoint(position);
    //       return;
    //     case "CUSTOM":
    //       addPoint((prevState) => [...prevState, position]);
    //       return;
    //     default:
    //       addMarker(position);
    //   }
    // }
    //
    // if (mode === "POLYGON") {
    //   switch (marker) {
    //     case "CUSTOM":
    //       addPoint((prevState) => [...prevState, position]);
    //       break;
    //     default:
    //       addMarker(position);
    //       break;
    //   }
    //
    //   setPolygons((prevState) => {
    //     return prevState.map((polygon, index) =>
    //       index === prevState.length - 1 ? [...polygon, position] : polygon,
    //     );
    //   });
    // }
  };

  // const removePoint = (event) => {
  //   addPoint((prevState) => removeFromCollection(event, prevState));
  //   removePolygonPoint(event);
  // };
  // const removePolygonPoint = (event) => {
  //   setPolygons((prevState) =>
  //     prevState.map((polygon) => removeFromCollection(event, polygon)),
  //   );
  // };

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

  // useEffect(() => {
  // setPolygons((prevState) => [...prevState, []]);
  // }, [mode, marker]);

  // const count = useSelector((state: RootState) => state.counter.value);
  // const countLabel = new Intl.NumberFormat().format(count);
  // const dispatch = useDispatch<AppDispatch>();

  console.log(handleMapClick);
  const dataImportHandler = (data: string[][]) => {
    data.forEach(([lat, lng]) => {
      const position = L.latLng([Number(lat), Number(lng)]);
      addMarker(position);
    });
  };

  const resetMap = () => {
    clearMarkers();
    clearTrackPoints();
    location.reload();
  };

  return (
    <MainLayout>
      <Map
        center={nbgCenter}
        zoom={3}
        scrollWheelZoom={true}
        bounceAtZoomLimits
      >
        <MapBounds disableZoom={false} />
        {/*<MapEvents onClick={handleMapClick} />*/}
        <LayerGroupMarker positions={markers} />
        <LayerControl position="topLeft" noIcon={true}>
          <ZoomControls />
        </LayerControl>
        <LayerControl position="topRight" icon={<ImportExportIcon />}>
          <Box display="flex" gap={2} p={2}>
            <ExportController label="Export Markers as CSV" data={markers} />
            <ImportController
              label="Import Markers from CSV"
              onLoad={dataImportHandler}
            />
            <button onClick={resetMap}>Reset</button>
          </Box>
        </LayerControl>
        <LayerControl position="bottomRight">
          <BaseMapsLayers />
        </LayerControl>
      </Map>
    </MainLayout>
  );
}
