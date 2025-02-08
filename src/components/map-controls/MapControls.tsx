import LayerControl from "components/layer-control/LayerControl.tsx";
import ZoomControls from "components/zoom-controls/ZoomControls.tsx";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ImportExportControls from "components/import-export-controls/ImportExportControls.tsx";
import BaseMapsLayers from "components/base-map-layers/BaseMapsLayers.tsx";
import ActionMenu from "components/action-menu/ActionMenu.tsx";

function MapControls() {
  return (
    <>
      <LayerControl position="topLeft" noIcon={true}>
        <ActionMenu />
      </LayerControl>
      <LayerControl position="topRight" noIcon={true}>
        <ZoomControls />
      </LayerControl>
      <LayerControl position="bottomRight">
        <BaseMapsLayers />
      </LayerControl>
      <LayerControl position="bottomLeft" icon={<ImportExportIcon />}>
        <ImportExportControls />
      </LayerControl>
    </>
  );
}

export default MapControls;
