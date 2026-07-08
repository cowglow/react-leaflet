import ExportController from "ports/components/import-export/ExportController.tsx";
import ImportController from "ports/components/import-export/ImportController.tsx";
import styled from "styled-components";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import { addMember } from "infrastructure/redux/member/member.slice.ts";
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

  const dataImportHandler = async (rows: string[][]) => {
    const imported = csvRowsToMembers(rows);
    const results = await Promise.allSettled(
      imported.map((member) => dispatch(addMember(member)).unwrap()),
    );
    const failed = results.filter((result) => result.status === "rejected").length;
    if (failed > 0) {
      alert(
        `Imported ${imported.length - failed} of ${imported.length} members ` +
          `(${failed} failed — likely already existed).`,
      );
    }
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
