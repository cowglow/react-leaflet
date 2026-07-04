import { Box } from "@mui/material";
import { PropsWithChildren, useEffect, useRef } from "react";
import { ControlPosition } from "ports/components/map/map.types.ts";

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
    }
  }, []);

  return (
    <div ref={containerRef} className={positionClass[position]}>
      <Box className="leaflet-control" px={1} py={padding}>
        {children}
      </Box>
    </div>
  );
}