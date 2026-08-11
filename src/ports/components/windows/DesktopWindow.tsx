import { PointerEvent as ReactPointerEvent, PropsWithChildren, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

export interface WindowPosition {
  x: number;
  y: number;
}

interface DesktopWindowProps {
  title: string;
  initialPosition?: WindowPosition;
  width?: string;
  height?: string;
}

const StyledDesktopWindow = styled("div")`
  position: absolute;
  display: flex;
  flex-direction: column;
`;

const StyledTitleBar = styled("div")`
  touch-action: none;
  cursor: grab;
`;

const StyledContent = styled("div")`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export default function DesktopWindow({
  title,
  initialPosition = { x: 24, y: 24 },
  width = "min(900px, 90vw)",
  height = "min(640px, 80vh)",
  children,
}: PropsWithChildren<DesktopWindowProps>) {
  const { t } = useTranslation();
  const [position, setPosition] = useState(initialPosition);
  const dragOffset = useRef<WindowPosition | null>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLButtonElement) {
      return;
    }
    dragOffset.current = { x: event.clientX - position.x, y: event.clientY - position.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragOffset.current) {
      return;
    }
    setPosition({
      x: event.clientX - dragOffset.current.x,
      y: event.clientY - dragOffset.current.y,
    });
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragOffset.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <StyledDesktopWindow
      className="window"
      style={{ top: position.y, left: position.x, width, height }}
    >
      <StyledTitleBar
        className="title-bar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
      >
        <button aria-label={t.common.close} disabled className="hidden" />
        <h1 className="title">{title}</h1>
        <button aria-label={t.common.resize} disabled className="hidden" />
      </StyledTitleBar>
      <div className="separator" />
      <StyledContent>{children}</StyledContent>
    </StyledDesktopWindow>
  );
}