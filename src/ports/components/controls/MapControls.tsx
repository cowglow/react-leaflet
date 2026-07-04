import LayerControl from "ports/components/controls/LayerControl.tsx";
import ZoomControls from "ports/components/controls/ZoomControls.tsx";
import BaseMapsLayers from "ports/components/base-maps/BaseMapsLayers.tsx";
import ActionMenu from "ports/components/action-menu/ActionMenu.tsx";
import { Paper } from "@mui/material";
import MapLayerGroup from "ports/components/map/Map.LayerGroup.tsx";
import ImportExportControls from "ports/components/import-export/ImportExportControls.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { ChangeEvent, MouseEventHandler, useState } from "react";
import { getMarkers } from "infrastructure/redux/marker/marker.selectors.ts";
import { setFilter } from "infrastructure/redux/marker/marker.slice.ts";
import { useMap } from "react-leaflet";

export default function MapControls() {
  const map = useMap();
  const [filterState, setFilterState] = useState(false);
  const [filterValue, setFilterValue] = useState(0);
  const dispatch = useDispatch();
  const markers = useSelector(getMarkers);

  const handleRangeChange = (event: ChangeEvent<HTMLInputElement>) => {
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

  const toggleFilter: MouseEventHandler<HTMLButtonElement> = () => {
    setFilterState((prevState) => {
      dispatch(prevState ? setFilter(filterValue) : dispatch(setFilter(markers.length)));
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