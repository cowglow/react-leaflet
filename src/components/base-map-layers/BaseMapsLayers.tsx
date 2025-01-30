import { useMap } from "react-leaflet";
import { baseMaps } from "components/base-map-layers/lib/base-maps.ts";
import { overlayMaps } from "components/base-map-layers/lib/overlay-maps.ts";
import { useEffect } from "react";
import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";

// import MenuIcon from "@mui/icons-material/Menu";

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

  return (
    <Paper sx={{ margin: 1 }}>
      <List disablePadding>
        {Object.keys(baseMaps).map((key) => {
          return (
            <ListItem
              disablePadding
              disableGutters
              secondaryAction={<Checkbox />}
            >
              <ListItemButton>
                <Typography>{key}</Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}

export default BaseMapsLayers;
