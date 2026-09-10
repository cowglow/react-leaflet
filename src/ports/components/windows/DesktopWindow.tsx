import { PointerEvent as ReactPointerEvent, PropsWithChildren, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

export interface WindowPosition {
  x: number;
  y: number;
}

interface DesktopWindowProps {
  title: string;
  onClose: () => void;
  initialPosition?: WindowPosition;
  width?: string;
  height?: string;
}

// A window can never be dragged so far that its title bar leaves the desktop —
// at least this much of the top-left corner (the close box + start of the drag
// handle) always stays on screen and grabbable.
const DRAG_MARGIN = 48;
// Expanded ("zoomed") windows fill the desktop except for this inset, and start
// just below the desktop menu bar.
const EXPANDED_INSET = 8;
const MENU_BAR_OFFSET = 40;

const StyledDesktopWindow = styled("div")`
  position: absolute;
  margin: 0;
  display: flex;
  flex-direction: column;
  /* Above the desktop, below the menu bar (1000) and modal backdrops (2000). */
  z-index: 100;
`;

const StyledTitleBar = styled("div")`
  touch-action: none;
`;

const StyledContent = styled("div")`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

function clampToDesktop({ x, y }: WindowPosition): WindowPosition {
  return {
    x: Math.min(Math.max(x, 0), window.innerWidth - DRAG_MARGIN),
    y: Math.min(Math.max(y, MENU_BAR_OFFSET), window.innerHeight - DRAG_MARGIN),
  };
}

export default function DesktopWindow({
  title,
  onClose,
  initialPosition = { x: 24, y: 24 },
  width = "min(900px, 90vw)",
  height = "min(640px, 80vh)",
  children,
}: PropsWithChildren<DesktopWindowProps>) {
  const { t } = useTranslation();
  const [position, setPosition] = useState(initialPosition);
  const [expanded, setExpanded] = useState(false);
  const dragOffset = useRef<WindowPosition | null>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // An expanded window is pinned to the desktop; the title-bar buttons handle
    // their own clicks and must not start a drag.
    if (expanded || event.target instanceof HTMLButtonElement) {
      return;
    }
    dragOffset.current = { x: event.clientX - position.x, y: event.clientY - position.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragOffset.current) {
      return;
    }
    setPosition(
      clampToDesktop({
        x: event.clientX - dragOffset.current.x,
        y: event.clientY - dragOffset.current.y,
      }),
    );
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragOffset.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  // Zoom toggles between the caller's size at the last dragged position and a
  // near-full-desktop box; restoring drops the window back exactly where it was.
  const geometry = expanded
    ? {
        top: MENU_BAR_OFFSET,
        left: EXPANDED_INSET,
        width: `calc(100vw - ${EXPANDED_INSET * 2}px)`,
        height: `calc(100vh - ${MENU_BAR_OFFSET + EXPANDED_INSET}px)`,
      }
    : { top: position.y, left: position.x, width, height };

  return (
    <StyledDesktopWindow className="window" style={geometry}>
      <StyledTitleBar
        className="title-bar"
        style={{ cursor: expanded ? "default" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
      >
        <button aria-label={t.common.close} className="close" onClick={onClose} />
        <h1 className="title">{title}</h1>
        <button
          aria-label={t.common.resize}
          aria-pressed={expanded}
          className="resize"
          onClick={() => setExpanded((value) => !value)}
        />
      </StyledTitleBar>
      <div className="separator" />
      <StyledContent>{children}</StyledContent>
    </StyledDesktopWindow>
  );
}
