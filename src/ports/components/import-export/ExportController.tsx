import useCsvData from "ports/components/import-export/use-csv-data.ts";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { Tooltip } from "@mui/material";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

interface ExportControllerProps {
  label: string;
  file?: string;
  data: GeoCoordinate[];
}

export default function ExportController({
  label,
  file = "output.csv",
  data,
}: ExportControllerProps) {
  const { exportCSVFile } = useCsvData();
  const clickHandler = () => {
    if (!data) return;
    exportCSVFile(data, file);
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