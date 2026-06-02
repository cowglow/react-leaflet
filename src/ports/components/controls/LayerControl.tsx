import { PropsWithChildren, ReactNode, useState } from "react";
import LayersIcon from "@mui/icons-material/Layers";
import { Box, ClickAwayListener } from "@mui/material";
import { StyledIconButton } from "ports/components/controls/LayerControl.Styled.ts";
import { LayerControlWrapper } from "ports/components/controls/LayerControlWrapper.tsx";
import { ControlPosition } from "ports/components/map/map.types.ts";

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

type LayerControlProps = LayerControlWithoutIconProps | LayerControlWithIconProps;

export default function LayerControl({
  position = "topLeft",
  noIcon = false,
  icon = <LayersIcon />,
  children,
}: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(noIcon);

  const clickAwayHandler = () => {
    if (!noIcon) {
      setIsOpen(false);
    }
  };

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
      <StyledIconButton className="btn" onClick={() => setIsOpen(true)}>
        {icon}
      </StyledIconButton>
    </LayerControlWrapper>
  );
}