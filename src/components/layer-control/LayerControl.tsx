import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

type ControlPosition = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

interface LayerControlProps extends PropsWithChildren {
  position?: ControlPosition;
}

const positionClass: Record<ControlPosition, string> = {
  topLeft: "leaflet-top leaflet-left",
  topRight: "leaflet-top leaflet-right",
  bottomRight: "leaflet-bottom leaflet-right",
  bottomLeft: "leaflet-bottom leaflet-left",
};

function LayerControl({ position = "topLeft", children }: LayerControlProps) {
  return (
    <Box className="leaflet-control-container">
      <div className={positionClass[position]}>{children}</div>
    </Box>
  );
}

export default LayerControl;
