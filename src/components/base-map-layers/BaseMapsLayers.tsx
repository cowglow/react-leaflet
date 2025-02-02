import { useMap } from "react-leaflet";
import { overlayMaps } from "components/base-map-layers/lib/overlay-maps.ts";
import { useEffect } from "react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { FormControl } from "@mui/material";
import "./style-overrides.css";
import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";

function BaseMapsLayers() {
  const { baseMaps, selectedBaseMap, setSelectedBaseMap } = useTileServer();
  const layers = Object.keys(baseMaps);
  const map = useMap();

  useEffect(() => {
    const layerControl = L.control.layers(baseMaps, overlayMaps, {
      collapsed: true,
    });
    map.addControl(layerControl);
    return () => {
      map.removeControl(layerControl);
    };
  }, []);

  useEffect(() => {
    // Clear BaseMaps
    layers.forEach((layer) => {
      if (map.hasLayer(baseMaps[layer])) {
        map.removeLayer(baseMaps[layer]);
      }
    });
    // Add BaseMap
    map.addLayer(baseMaps[selectedBaseMap]);
  }, [selectedBaseMap]);

  return (
    <FormControl>
      <RadioGroup
        name="leaflet-base-layers"
        defaultValue={layers[0]}
        onChange={(_, value) => setSelectedBaseMap(value)}
      >
        {layers.map((key) => (
          <FormControlLabel value={key} control={<Radio />} label={key} />
        ))}
      </RadioGroup>
    </FormControl>
  );
  /*
  return (
    <List disablePadding>
      {Object.keys(baseMaps).map((key) => {
        return (
          <ListItem
            disablePadding
            disableGutters
            secondaryAction={<Checkbox />}
            onClick={setBaseLayer(key)}
          >
            <ListItemButton>
              <Typography>{key}</Typography>
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
   */
}

export default BaseMapsLayers;
