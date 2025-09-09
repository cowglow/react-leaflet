import LayerControl from "components/layer-control/LayerControl.tsx";
import ZoomControls from "components/zoom-controls/ZoomControls.tsx";
import BaseMapsLayers from "components/base-map-layers/BaseMapsLayers.tsx";
import ActionMenu from "components/action-menu/ActionMenu.tsx";
import { Paper } from "@mui/material";
import MapLayerGroup from "feature/map/Map.LayerGroup.tsx";
import ImportExportControls from "components/import-export-controls/ImportExportControls.tsx";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent } from "react";
import { getMarkers } from "../../redux-store/store/marker/marker-selectors.ts";
import { setFilter } from "../../redux-store/store/marker/marker-slice.ts";
import { useMap } from "react-leaflet";
import GyroscopeControl from "../gyroscope-control/GyroscopeControl.tsx";

function MapControls() {
  const map = useMap();
  const dispatch = useDispatch();
  const markers = useSelector(getMarkers);

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilter(Number(event.target.value)));
  };

  const toggleMapDrag = (action: boolean) => {
    if (action) {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
  };

  return (
    <>
      <LayerControl position="topLeft" noIcon={true}>
        <ActionMenu />
      </LayerControl>
      <LayerControl position="topRight">
        <Paper className="standard-dialog" elevation={2}>
          <MapLayerGroup>Map Layer Group</MapLayerGroup>
          <hr />
          <BaseMapsLayers />
        </Paper>
      </LayerControl>
      <LayerControl position="bottomRight" noIcon={true}>
        <ImportExportControls />
      </LayerControl>
      <LayerControl position="bottomLeft" noIcon={true}>
        <Paper
          onMouseEnter={() => toggleMapDrag(false)}
          onMouseLeave={() => toggleMapDrag(true)}
          className="standard-dialog"
          elevation={2}
        >
          <label htmlFor="filterRange">Filter Range</label>
          <br />
          <input
            type="range"
            name="filterRange"
            onChange={handleRangeChange}
            //defaultValue={markers.length}
            min={0}
            max={markers.length}
            onPointerDown={(e) => e.stopPropagation()}
          />
          <ZoomControls />
          <GyroscopeControl />
        </Paper>
      </LayerControl>
    </>
  );
}

export default MapControls;
