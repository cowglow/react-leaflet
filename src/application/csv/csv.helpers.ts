export function parseCSVString(csvString: string | null): string[][] | null {
  if (!csvString) return null;
  const [, ...rows] = csvString.trim().split("\n");
  return rows.map((row) => row.split(","));
}

export function convertToCSV<T extends Record<string, unknown>>(data: T[]): string {
  if (data.length === 0) return "";
  const header = Object.keys(data[0]);
  const csvRows = [header.join(",")];
  for (const item of data) {
    const row = header.map((key) => item[key]).join(",");
    csvRows.push(row);
  }
  return csvRows.join("\n");
}