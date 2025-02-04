import { Box, ClickAwayListener, Paper } from "@mui/material";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import LayersIcon from "@mui/icons-material/Layers";
// import { useEventHandlers } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
import { StyledIconButton } from "components/layer-control/LayerControl.Styled.ts";

type ControlPosition = "topLeft" | "topRight" | "bottomRight" | "bottomLeft";

interface BaseLayerControlProps extends PropsWithChildren {
  position?: ControlPosition;
}

interface LayerControlWithoutIconProps extends BaseLayerControlProps {
  noIcon: true;
  icon?: never;
}

interface LayerControlWithIconProps extends BaseLayerControlProps {
  noIcon?: false;
  icon?: ReactNode;
}

type LayerControlProps =
  | LayerControlWithoutIconProps
  | LayerControlWithIconProps;

const positionClass: Record<ControlPosition, string> = {
  topLeft: "leaflet-top leaflet-left",
  topRight: "leaflet-top leaflet-right",
  bottomRight: "leaflet-bottom leaflet-right",
  bottomLeft: "leaflet-bottom leaflet-left",
};

function LayerControl({
  position = "topLeft",
  noIcon = false,
  icon = <LayersIcon />,
  children,
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(noIcon);
  const [isHovering, setIsHovering] = useState(false);

  const map = useMap();

  useEffect(() => {
    if (isOpen || isHovering) {
      // @ts-ignore
      Object.values(map["_handlers"]).forEach((handler) => handler.disable());
    } else {
      // @ts-ignore
      Object.values(map["_handlers"]).forEach((handler) => handler.enable());
    }
    return () => {
      console.log("unmount", map);
    };
  }, [isOpen, isHovering]);

  const padding = position === "bottomRight" ? 2 : 1;
  return (
    <div className={positionClass[position]}>
      <Box className="leaflet-control" px={1} py={padding}>
        {!isOpen ? (
          <StyledIconButton
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            size="small"
          >
            {icon}
          </StyledIconButton>
        ) : (
          <ClickAwayListener
            onClickAway={() => {
              if (!noIcon) {
                setIsOpen(false);
                setIsHovering(false);
              }
            }}
          >
            <Paper elevation={2}>
              {/*<div className="window">*/}
              {/*  <div className="title-bar">*/}
              {/*    <button aria-label="Close" className="close"></button>*/}
              {/*    <h1 className="title">Select Base Map</h1>*/}
              {/*    <button*/}
              {/*      aria-label="Resize"*/}
              {/*      disabled*/}
              {/*      className="hidden"*/}
              {/*    ></button>*/}
              {/*  </div>*/}
              {children}
              {/*</div>*/}
            </Paper>
          </ClickAwayListener>
        )}
      </Box>
    </div>
  );
}

export default LayerControl;
