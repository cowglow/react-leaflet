import { convertToCSV } from "application/csv/csv.helpers.ts";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

export function createCSVFile(csvString: string, filename: string): void {
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(url);
}

export async function loadCSVFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input: HTMLInputElement = document.querySelector("#input-file-button");

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

export async function exportCSVFile(data: GeoCoordinate[]): Promise<void> {
  const csvData = data.map(({ lat, lng }) => ({ lat, lng }));
  const fileContent = convertToCSV(csvData);
  createCSVFile(fileContent, "output.csv");
}