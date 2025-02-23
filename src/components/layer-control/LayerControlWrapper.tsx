import { Box } from "@mui/material";
import { PropsWithChildren } from "react";
import { ControlPosition } from "feature/map/typing.ts";

const positionClass: Record<ControlPosition, string> = {
  topLeft: "leaflet-top leaflet-left",
  topRight: "leaflet-top leaflet-right",
  bottomRight: "leaflet-bottom leaflet-right",
  bottomLeft: "leaflet-bottom leaflet-left",
};

interface LayerControlWrapperProps extends PropsWithChildren {
  position: ControlPosition;
  padding: number;
}

export function LayerControlWrapper(props: LayerControlWrapperProps) {
  const { position, padding, children } = props;
  return (
    <div className={positionClass[position]}>
      <Box className="leaflet-control" px={1} py={padding}>
        {children}
      </Box>
    </div>
  );
}
