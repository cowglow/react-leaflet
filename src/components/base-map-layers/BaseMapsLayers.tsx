import { useMap } from "react-leaflet";
// import { overlayMaps } from "components/base-map-layers/lib/overlay-maps.ts";
import { ChangeEvent, useEffect } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
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
  }, [selectedBaseMap]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedBaseMap((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <div className="standard-dialog">
        <RadioGroup
          name="leaflet-base-layers"
          value={selectedBaseMap}
          onChange={handleChange}
        >
          {layers.map((key) => (
            <FormControlLabel value={key} control={<Radio />} label={key} />
          ))}
        </RadioGroup>
      </div>
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
