export function convertToCSV<T extends Record<string, unknown>>(
  data: T[],
): string {
  if (data.length === 0) {
    return "";
  }

  const header = Object.keys(data[0]);
  const csvRows = [header.join(",")];

  for (const item of data) {
    const row = header.map((key) => item[key]).join(",");
    csvRows.push(row);
  }

  return csvRows.join("\n");
}

export function exportCSVFile(csvString: string, filename: string): void {
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  // Clean up after download
  URL.revokeObjectURL(url);
}
