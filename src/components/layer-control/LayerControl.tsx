import { PropsWithChildren, ReactNode, useState } from "react";
import LayersIcon from "@mui/icons-material/Layers";
import { Box, ClickAwayListener } from "@mui/material";
import { StyledIconButton } from "components/layer-control/LayerControl.Styled.ts";
import { LayerControlWrapper } from "components/layer-control/LayerControlWrapper.tsx";
import { ControlPosition } from "feature/map/typing.ts";

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

export default function LayerControl({
  position = "topLeft",
  noIcon = false,
  icon = <LayersIcon />,
  children,
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(noIcon);
  // const [isHovering, setIsHovering] = useState(false);
  // const map = useMap();

  const clickAwayHandler = () => {
    if (!noIcon) {
      setIsOpen(false);
      // setIsHovering(false);
    }
  };

  // useEffect(() => {
  //   if (isOpen || isHovering) {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     Object.values(map["_handlers"]).forEach((handler) => handler.disable());
  //   } else {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     Object.values(map["_handlers"]).forEach((handler) => handler.enable());
  //   }
  //   return () => {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     Object.values(map["_handlers"]).forEach((handler) => handler.enable());
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOpen, isHovering]);

  const padding = position === "bottomRight" ? 2 : 1;

  if (isOpen)
    return (
      <LayerControlWrapper position={position} padding={padding}>
        <ClickAwayListener onClickAway={clickAwayHandler}>
          <Box>{children}</Box>
        </ClickAwayListener>
      </LayerControlWrapper>
    );

  return (
    <LayerControlWrapper position={position} padding={padding}>
      <StyledIconButton
        className="btn"
        onClick={() => setIsOpen(true)}
        // onMouseEnter={() => setIsHovering(true)}
        // onMouseLeave={() => setIsHovering(false)}
      >
        {icon}
      </StyledIconButton>
    </LayerControlWrapper>
  );
}
