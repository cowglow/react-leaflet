const littleton = L.marker([39.61, -105.02]).bindPopup(
  "This is Littleton, CO.",
);
const denver = L.marker([39.74, -104.99]).bindPopup("This is Denver, CO.");
const aurora = L.marker([39.73, -104.8]).bindPopup("This is Aurora, CO.");
const golden = L.marker([39.77, -105.23]).bindPopup("This is Golden, CO.");

const crownHill = L.marker([39.75, -105.09]).bindPopup(
  "This is Crown Hill Park.",
);
const rubyHill = L.marker([39.68, -105.0]).bindPopup("This is Ruby Hill Park.");

export const overlayMaps = {
  Cities: L.layerGroup([littleton, denver, aurora, golden]),
  Parks: L.layerGroup([crownHill, rubyHill]),
};
