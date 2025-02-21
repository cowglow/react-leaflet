import L from "leaflet";
import { useMarkers } from "hooks/use-markers.ts";
import { ExportController, ImportController } from "feature/csv";
import { StyledAction } from "components/import-export-controls/ImportExportControls.Sttyles.ts";

function ImportExportControls() {
  const { markers, addMarker } = useMarkers();

  const dataImportHandler = (data: string[][]) => {
    data.forEach(([lat, lng]) => {
      const position = L.latLng([Number(lat), Number(lng)]);
      addMarker(position);
    });
  };

  return (
    <StyledAction>
      <ExportController label="Export Markers as CSV" data={markers} />
      <ImportController
        label="Import Markers from CSV"
        onLoad={dataImportHandler}
      />
    </StyledAction>
  );
}

export default ImportExportControls;
