// import { TileLayer } from "react-leaflet";
// import { TileLayer } from "leaflet";
// import WMS = TileLayer.WMS;

type BaseMapConfig = {
  name: string;
  url: string;
  type: "wms" | undefined;
  maxZoom: number;
  attribution: number;
  layers: string;
  format: string;
  transparent: true;
};

const resources = [
  {
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  },
  {
    name: "hotosm",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    maxZoom: 19,
    attribution:
      "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
  },
  {
    name: "OpenWeatherMap",
    url: "https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=your_api_key",
    type: "wms",
    layers: "1",
    format: "image/png",
    transparent: true,
    attribution: "OpenWeatherMap",
  },
];

function createBaseMaps(resources) {
  const tileLayers = {
    default: L.tileLayer,
    wms: L.tileLayer.wms,
  };
  return resources.map(({ name, url, type = "default", ...options }) => ({
    [name]: tileLayers[type](options),
  }));
}

export const baseMaps = createBaseMaps(resources);
