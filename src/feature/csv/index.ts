import useCsvData from "./hook/use-csv-data.tsx";
import ImportController from "./component/ImportController.tsx";
import ExportController from "./component/ExportController.tsx";
import { convertToCSV, createCSVFile } from "feature/csv/hook/helper.ts";

export { useCsvData, ImportController, ExportController };

export async function loadCSVFile() {
  return new Promise((resolve, reject) => {
    const input: HTMLInputElement =
      document.querySelector("#input-file-button");

    input.addEventListener("click", () => {
      const file = input.files?.[0];
      if (!file) {
        reject(new Error("No file selected"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (content) {
          resolve(content as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.readAsText(file);
    });

    input.click();
  });
}

export async function exportCSVFile(data: CSVData[]) {
  const csvData: CSVData[] = data.map(({ lat, lng }) => ({ lat, lng }));
  const fileContent = convertToCSV(csvData);
  createCSVFile(fileContent, "output.csv");
}
