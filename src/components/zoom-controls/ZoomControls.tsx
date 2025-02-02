import { Box } from "@mui/material";
import { useMap } from "react-leaflet";
import { useCallback } from "react";
import PlusIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";

export default function ZoomControls() {
  const map = useMap();

  const zoom = useCallback(
    (direction: "in" | "out") => {
      switch (direction) {
        case "in":
          map.zoomIn();
          break;
        case "out":
          map.zoomOut();
          break;
        default:
          map.zoomIn();
      }
    },
    [map],
  );

  return (
    <Box display="flex" flexDirection="column">
      <button onClick={() => zoom("in")}>
        <PlusIcon />
      </button>
      <button onClick={() => zoom("out")}>
        <MinusIcon />
      </button>
    </Box>
  );
}
