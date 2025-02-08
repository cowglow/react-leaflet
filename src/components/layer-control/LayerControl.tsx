import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import LayersIcon from "@mui/icons-material/Layers";
import { Box, ClickAwayListener } from "@mui/material";
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.values(map["_handlers"]).forEach((handler) => handler.disable());
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.values(map["_handlers"]).forEach((handler) => handler.enable());
    }
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Object.values(map["_handlers"]).forEach((handler) => handler.enable());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isHovering]);

  const padding = position === "bottomRight" ? 2 : 1;
  return (
    <div className={positionClass[position]}>
      <Box className="leaflet-control" px={1} py={padding}>
        {!isOpen ? (
          <StyledIconButton
            className="btn"
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
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
            <Box>{children}</Box>
          </ClickAwayListener>
        )}
      </Box>
    </div>
  );
}

export default LayerControl;
