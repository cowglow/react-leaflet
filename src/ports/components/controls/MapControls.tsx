import LayerControl from "ports/components/controls/LayerControl.tsx";
import ZoomControls from "ports/components/controls/ZoomControls.tsx";
import BaseMapsLayers from "ports/components/base-maps/BaseMapsLayers.tsx";
import { Paper } from "@mui/material";
import StraightenIcon from "@mui/icons-material/Straighten";
import MapLayerGroup from "ports/components/map/Map.LayerGroup.tsx";
import ImportExportControls from "ports/components/import-export/ImportExportControls.tsx";
import DistanceControl from "ports/components/controls/DistanceControl.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { ChangeEvent, MouseEventHandler, useState } from "react";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import { setFilter } from "infrastructure/redux/member/member.slice.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { useMap } from "react-leaflet";

export default function MapControls() {
  const map = useMap();
  const { t } = useTranslation();
  const [filterState, setFilterState] = useState(true);
  const [filterValue, setFilterValue] = useState(0);
  const dispatch = useDispatch();
  const members = useSelector(getMembers);

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
      dispatch(setFilter(prevState ? filterValue : members.length));
      return !prevState;
    });
  };

  return (
    <>
      <LayerControl position="topRight">
        <Paper className="standard-dialog" elevation={2}>
          <MapLayerGroup>{t.mapControls.mapLayerGroup}</MapLayerGroup>
          <hr />
          <BaseMapsLayers />
        </Paper>
      </LayerControl>
      <LayerControl position="bottomRight" noIcon={true}>
        <ImportExportControls />
      </LayerControl>
      <LayerControl position="topRight" icon={<StraightenIcon />}>
        <DistanceControl />
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
              {t.mapControls.filterRange}
            </label>
            <br />
            <input
              type="range"
              name="filterRange"
              onChange={handleRangeChange}
              value={filterValue}
              min={0}
              max={members.length}
              disabled={filterState}
            />
            &nbsp;
            <button className="btn" onClick={toggleFilter}>
              {filterState ? t.mapControls.enable : t.mapControls.disable}
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