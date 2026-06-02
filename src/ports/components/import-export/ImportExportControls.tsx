import ExportController from "ports/components/import-export/ExportController.tsx";
import ImportController from "ports/components/import-export/ImportController.tsx";
import styled from "styled-components";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getMarkers } from "infrastructure/redux/marker/marker.selectors.ts";
import { openFileDone } from "infrastructure/redux/marker/marker.slice.ts";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

const ImportExportContainer = styled("div")`
  display: flex;
  gap: 0.33rem;

  & > button,
  button:disabled {
    display: flex;
    padding: 0;
    min-height: unset;
    min-width: unset;
    border-radius: 30%;
  }
`;

function ImportExportControls() {
  const dispatch = useDispatch();
  const markers = useSelector(getMarkers);

  const dataImportHandler = (data: string[][]) => {
    const items: GeoCoordinate[] = data.map(([lat, lng]) => ({
      lat: Number(lat),
      lng: Number(lng),
    }));
    dispatch(openFileDone({ items }));
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