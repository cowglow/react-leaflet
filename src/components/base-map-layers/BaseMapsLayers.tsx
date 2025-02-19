import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "./style-overrides.css";
import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";

function BaseMapsLayers() {
  const { baseMaps, selectedBaseMap, setSelectedBaseMap } = useTileServer();
  const layers = Object.keys(baseMaps);
  const map = useMap();

  useEffect(() => {
    layers.forEach((layer) => {
      if (map.hasLayer(baseMaps[layer])) {
        map.removeLayer(baseMaps[layer]);
      }
    });
    map.addLayer(baseMaps[selectedBaseMap]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBaseMap]);

  return layers.map((key, index) => (
    <div className="field-row">
      <input
        id={`base-layer-option-${index}`}
        type="radio"
        name="first-example"
        onClick={() => setSelectedBaseMap(key)}
      />
      <label htmlFor={`base-layer-option-${index}`}>{key}</label>
    </div>
  ));
}

export default BaseMapsLayers;
