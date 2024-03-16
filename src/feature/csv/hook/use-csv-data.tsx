import { convertToCSV, createCSVFile, parseCSVString } from "./helper.ts";
import { useEffect, useState } from "react";

export default function useCsvData() {
  const reader = new FileReader();
  const [data, setData] = useState<string[][] | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!file) return;

    const readerLoadHandler = ({ target }) => {
      const parsedResult = parseCSVString(target.result);
      setData(parsedResult);
    };

    reader.addEventListener("load", readerLoadHandler);
    reader.readAsText(file);

    return () => {
      reader.removeEventListener("load", readerLoadHandler);
    };
  }, [file]);

  const exportCSVFile = (csvData: CSVData[], filename: string) => {
    const fileContent = convertToCSV(csvData);
    createCSVFile(fileContent, filename);
  };

  return {
    data,
    importCSVFile: setFile,
    exportCSVFile,
  };
}
