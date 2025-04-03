import { ExportController, ImportController } from "feature/csv";
import { ImportExportContainer } from "components/import-export-controls/ImportExportControls.Sttyles.ts";
import { useDispatch, useSelector } from "redux-store/hooks.ts";
import { getMarkers } from "redux-store/store/marker/marker-selectors.ts";
import { openFileDone } from "redux-store/store/marker/marker-slice.ts";

function ImportExportControls() {
  const dispatch = useDispatch();
  const markers = useSelector(getMarkers);

  const dataImportHandler = (data: string[][]) => {
    dispatch(
      openFileDone({
        items: data.map(([lat, lng]) => L.latLng([Number(lat), Number(lng)])),
      }),
    );
  };

  return (
    <ImportExportContainer>
      <ExportController label="Export Markers as CSV" data={markers} />
      <ImportController
        label="Import Markers from CSV"
        onLoad={dataImportHandler}
      />
    </ImportExportContainer>
  );
}

export default ImportExportControls;
