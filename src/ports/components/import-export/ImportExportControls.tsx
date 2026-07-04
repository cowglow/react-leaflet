import ExportController from "ports/components/import-export/ExportController.tsx";
import ImportController from "ports/components/import-export/ImportController.tsx";
import styled from "styled-components";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import { loadMembers } from "infrastructure/redux/member/member.slice.ts";
import { csvRowsToMembers } from "application/csv/member.csv.ts";

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
  const members = useSelector(getMembers);

  const dataImportHandler = (rows: string[][]) => {
    dispatch(loadMembers(csvRowsToMembers(rows)));
  };

  return (
    <ImportExportContainer>
      <ExportController label="Export Members as CSV" data={members} />
      <ImportController
        label="Import Members from CSV"
        onLoad={dataImportHandler}
      />
    </ImportExportContainer>
  );
}

export default ImportExportControls;
