import type { ChangeEvent } from "react";
import useCsvData from "../hook/use-csv-data";
import { useEffect } from "react";

interface ImportControllerProps {
  label: string;
  onLoad?: (value: string[][]) => void;
}

export default function ImportController({
  label,
  onLoad,
}: ImportControllerProps) {
  const { data, importCSVFile } = useCsvData();

  const inputHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = target.files && target.files[0];
    if (!selectedFile) return;
    importCSVFile(selectedFile);
  };

  useEffect(() => {
    if (!data) return;
    if (onLoad) {
      onLoad(data);
    }
  }, [data]);

  return (
    <label>
      {label}
      <input onInput={inputHandler} type="file" />
    </label>
  );
}
