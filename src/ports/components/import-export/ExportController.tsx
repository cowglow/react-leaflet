import useCsvData from "ports/components/import-export/use-csv-data.ts";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { Tooltip } from "@mui/material";
import type { Member } from "domain/member/member.types.ts";
import { memberToCSVRow } from "application/csv/member.csv.ts";

interface ExportControllerProps {
  label: string;
  file?: string;
  data: Member[];
}

export default function ExportController({
  label,
  file = "members.csv",
  data,
}: ExportControllerProps) {
  const { exportCSVFile } = useCsvData();
  const clickHandler = () => {
    if (!data) return;
    exportCSVFile(data.map(memberToCSVRow), file);
  };

  const isDisabled = false;

  return (
    <Tooltip title={label} placement="right">
      <button className="btn" onClick={clickHandler} disabled={isDisabled}>
        <ImportExportIcon />
      </button>
    </Tooltip>
  );
}