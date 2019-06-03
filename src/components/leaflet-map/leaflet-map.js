import React, { useEffect } from "react";
import L from "leaflet";

import style from "./leaflet-map.module.css";

const LeafletMap = ({ latlng, zoom }) => {
  const provider = 'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png';
  const attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  useEffect(() => {
    L.map("map", {
      center: latlng,
      zoom: zoom,
      layers: [
        L.tileLayer(provider, {attribution: attribution})
      ]
    });
  });

  return <div id="map" className={style.map} />;
};

export default LeafletMap;
