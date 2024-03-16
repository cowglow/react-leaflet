import useCsvData from "../hook/use-csv-data";

interface ExportControllerProps {
  label: string;
  file?: string;
  data: L.LatLng[];
}

export default function ExportController({
  label,
  file = "output.csv",
  data,
}: ExportControllerProps) {
  const { exportCSVFile } = useCsvData();
  const clickHandler = () => {
    if (!data) return;

    const csvData: CSVData[] = data.map(({ lat, lng }) => ({ lat, lng }));
    exportCSVFile(csvData, file);
  };

  return (
    <button onClick={clickHandler} disabled={data.length <= 0}>
      {label}
    </button>
  );
}
