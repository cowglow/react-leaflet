import { convertToCSV, exportCSVFile } from "utils/helper.ts";
import type { LatLng } from "leaflet";

type CSVData = Record<string, unknown>

interface ExportControllerProps {
  label: string;
  data: LatLng[];
}

export default function ExportController({ label, data }: ExportControllerProps) {
  const clickHandler = () => {
    if (!data) return;

    const csvData: CSVData[] = data.map(({ lat, lng }) => ({ lat, lng }));
    const output = convertToCSV(csvData);
    exportCSVFile(output, "output.csv");
  };

  return <button onClick={clickHandler} disabled={data.length <= 0}>{label}</button>;
}
