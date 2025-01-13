import { useMap } from "react-leaflet";
import { baseMaps } from "components/base-map-layers/lib/base-maps.ts";
import { overlayMaps } from "components/base-map-layers/lib/overlay-maps.ts";
import { memo, useEffect } from "react";

function BaseMapsLayers() {
  const map = useMap();

  useEffect(() => {
    const layerControl = L.control.layers(baseMaps, overlayMaps, {
      collapsed: false,
    });
    map.addControl(layerControl);
    return () => {
      map.removeControl(layerControl);
    };
  }, []);

  return null;
}

export default memo(BaseMapsLayers);
