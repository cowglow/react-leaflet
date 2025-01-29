// import { TileLayer } from "react-leaflet";
// import { TileLayer } from "leaflet";
// import WMS = TileLayer.WMS;

// type BaseMapConfig = {
//   name: string;
//   url: string;
//   type: "wms" | undefined;
//   maxZoom: number;
//   attribution: number;
//   layers: string;
//   format: string;
//   transparent: true;
// };

const resources = [
  {
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  },
  {
    name: "hot osm",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution:
      "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
  },
  {
    name: "Open Weather Map",
    url: "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=your_api_key",
    type: "wms",
    layers: "1",
    format: "image/png",
    transparent: true,
    attribution: "OpenWeatherMap",
  },
];

const tileLayers = {
  default: L.tileLayer,
  wms: L.tileLayer.wms,
};

function createBaseMaps(resources) {
  return resources.map(({ name, url, type, ...options }) => {
    const tileType = type ?? "default";
    return {
      [name]: tileLayers[tileType](options),
    };
  });
}

export const baseMaps = createBaseMaps(resources);
console.log({ baseMaps });
