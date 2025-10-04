import LayerControl from "components/layer-control/LayerControl.tsx";
import ZoomControls from "components/zoom-controls/ZoomControls.tsx";
import BaseMapsLayers from "components/base-map-layers/BaseMapsLayers.tsx";
import ActionMenu from "components/action-menu/ActionMenu.tsx";
import { Paper } from "@mui/material";
import MapLayerGroup from "feature/map/Map.LayerGroup.tsx";
import ImportExportControls from "components/import-export-controls/ImportExportControls.tsx";
import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, MouseEventHandler, useState } from "react";
import { getMarkers } from "../../redux-store/store/marker/marker-selectors.ts";
import { setFilter } from "../../redux-store/store/marker/marker-slice.ts";
import { useMap } from "react-leaflet";
// import GyroscopeControl from "../gyroscope-control/GyroscopeControl.tsx";
// import NavigatorControl from "../navigator-control/NavigatorControl.tsx";

export default function MapControls() {
  const map = useMap();
  const [filterState, setFilterState] = useState(false);
  const [filterValue, setFilterValue] = useState(0);
  const dispatch = useDispatch();
  const markers = useSelector(getMarkers);

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
    L.DomEvent.disableClickPropagation(event.target);
    dispatch(setFilter(Number(event.target.value)));
    setFilterValue(Number(event.target.value));
  };

  const toggleMapDrag = (action: boolean) => {
    if (action) {
      map.dragging.enable();
    } else {
      map.dragging.disable();
    }
  };

  const toggleFilter: MouseEventHandler<HTMLButtonElement> = (event) => {
    L.DomEvent.disableClickPropagation(event.currentTarget);
    setFilterState((prevState) => {
      dispatch(
        prevState
          ? setFilter(filterValue)
          : dispatch(setFilter(markers.length)),
      );
      return !prevState;
    });
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
          sx={{ display: "flex", flexDirection: "column", gap: 1 }}
        >
          <div>
            <label htmlFor="filterRange" aria-disabled={filterState}>
              Filter Range
            </label>
            <br />
            <input
              type="range"
              name="filterRange"
              onChange={handleRangeChange}
              value={filterValue}
              min={0}
              max={markers.length}
              disabled={filterState}
            />
            &nbsp;
            <button className="btn" onClick={toggleFilter}>
              {filterState ? "Enable" : "Disable"}
            </button>
          </div>
          <ZoomControls />
          {/*<GyroscopeControl />*/}
          {/*<NavigatorControl />*/}
        </Paper>
      </LayerControl>
    </>
  );
}
