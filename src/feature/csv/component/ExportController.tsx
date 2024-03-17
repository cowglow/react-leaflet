import useCsvData from "../hook/use-csv-data";
import { StyledExportControllerButton } from "./ExportButton.Styled.ts";

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

  const isDisabled = data.length <= 0;

  return (
    <StyledExportControllerButton onClick={clickHandler} disabled={isDisabled}>
      {label}
    </StyledExportControllerButton>
  );
}
