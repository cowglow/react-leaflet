import { Box, ClickAwayListener } from "@mui/material";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import LayersIcon from "@mui/icons-material/Layers";
// import { useEventHandlers } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import { StyledIconButton } from "components/layer-control/LayerControl.Styled.ts";

type ControlPosition = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

interface LayerControlProps extends PropsWithChildren {
  position?: ControlPosition;
  icon?: ReactNode;
}

const positionClass: Record<ControlPosition, string> = {
  topLeft: "leaflet-top leaflet-left",
  topRight: "leaflet-top leaflet-right",
  bottomRight: "leaflet-bottom leaflet-right",
  bottomLeft: "leaflet-bottom leaflet-left",
};

function LayerControl({
  position = "topLeft",
  icon = <LayersIcon />,
  children,
}: LayerControlProps) {
  const [open, setOpen] = useState(false);

  const map = useMap();

  useEffect(() => {
    if (open) {
      // @ts-ignore
      Object.values(map["_handlers"]).forEach((handler) => handler.disable());
    } else {
      // @ts-ignore
      Object.values(map["_handlers"]).forEach((handler) => handler.enable());
    }
    return () => {
      console.log("unmount", map);
    };
  }, [open]);

  const toggleMapEvents = () => {
    console.log({ mapEventHandlers: Object.values(map["_handlers"]) });
  };

  return (
    <div className={positionClass[position]}>
      <Box className="leaflet-control" px={2} py={4}>
        {!open ? (
          <StyledIconButton
            onClick={() => setOpen(true)}
            onMouseEnter={() => toggleMapEvents()}
            onMouseLeave={() => toggleMapEvents()}
            size="small"
          >
            {icon}
          </StyledIconButton>
        ) : (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Box>{children}</Box>
          </ClickAwayListener>
        )}
      </Box>
    </div>
  );
}

export default LayerControl;
