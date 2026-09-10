export function createGeoJSONFile(geoJsonString: string, filename: string): void {
  const blob = new Blob([geoJsonString], { type: "application/geo+json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  URL.revokeObjectURL(url);
}
