import L from "leaflet";
import { useMarkers } from "hooks/use-markers.ts";
import { Paper } from "@mui/material";
import { ExportController, ImportController } from "feature/csv";

function ImportExportControls() {
  const { markers, addMarker } = useMarkers();

  const dataImportHandler = (data: string[][]) => {
    data.forEach(([lat, lng]) => {
      const position = L.latLng([Number(lat), Number(lng)]);
      addMarker(position);
    });
  };

  return (
    <Paper
      className="standard-dialog"
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <ExportController label="Export Markers as CSV" data={markers} />
      <ImportController
        label="Import Markers from CSV"
        onLoad={dataImportHandler}
      />
    </Paper>
  );
}

export default ImportExportControls;
