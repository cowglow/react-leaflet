import { PointerEvent as ReactPointerEvent, PropsWithChildren, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

export interface WindowPosition {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

interface DesktopWindowProps {
  title: string;
  onClose: () => void;
  initialPosition?: WindowPosition;
  width?: string;
  /** A CSS length, or "auto" to size to the content (capped to the desktop). */
  height?: string;
  /** Pad the content area and let it scroll — for forms and text, not the map. */
  padded?: boolean;
  /** Stacking order among the floating windows; defaults to the base layer. */
  z?: number;
  /** Called on any pointer-down inside the window — cycle it to the front. */
  onFocus?: () => void;
}

// Expanded ("zoomed") windows fill the desktop except for this inset, and start
// just below the desktop menu bar.
const EXPANDED_INSET = 8;
const MENU_BAR_OFFSET = 40;
// A manually-resized window can never get smaller than this, so its title bar
// (close box, zoom box) always stays usable.
const MIN_WIDTH = 240;
const MIN_HEIGHT = 160;

const BASE_Z = 100;

// z-index is set inline from the `z` prop (per-window stacking order). It stays
// between the desktop and the menu bar (1000); modal backdrops (2000) are above.
const StyledDesktopWindow = styled("div")`
  position: absolute;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const StyledTitleBar = styled("div")`
  touch-action: none;
`;

const StyledContent = styled("div")`
  min-height: 0;
`;

// A classic Mac-style grow box in the bottom-right corner — diagonal stripes,
// drag to resize. Hidden while expanded (a zoomed window is pinned to a fixed
// near-fullscreen box, resizing it doesn't mean anything).
const StyledResizeHandle = styled("div")`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  touch-action: none;
  background: linear-gradient(
    135deg,
    transparent 0,
    transparent 38%,
    #000 38%,
    #000 46%,
    transparent 46%,
    transparent 60%,
    #000 60%,
    #000 68%,
    transparent 68%,
    transparent 82%,
    #000 82%,
    #000 90%,
    transparent 90%
  );
`;

// A window never leaves the desktop on any edge — clamped against its actual
// rendered size (measured via a ref), not a fixed "stay grabbable" margin, so
// dragging right/down stops exactly at the edge the same way left/up already do.
function clampToDesktop({ x, y }: WindowPosition, size: WindowSize): WindowPosition {
  const maxX = Math.max(0, window.innerWidth - size.width);
  const maxY = Math.max(MENU_BAR_OFFSET, window.innerHeight - size.height);
  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, MENU_BAR_OFFSET), maxY),
  };
}

export default function DesktopWindow({
  title,
  onClose,
  initialPosition = { x: 24, y: 24 },
  width = "min(900px, 90vw)",
  height = "min(640px, 80vh)",
  padded = false,
  z = BASE_Z,
  onFocus,
  children,
}: PropsWithChildren<DesktopWindowProps>) {
  const { t } = useTranslation();
  const [position, setPosition] = useState(initialPosition);
  const [expanded, setExpanded] = useState(false);
  // Once set (by dragging the grow box), this overrides the width/height props
  // for as long as the window exists — same as a real window remembering the
  // size you last dragged it to.
  const [manualSize, setManualSize] = useState<WindowSize | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<WindowPosition | null>(null);
  const dragSize = useRef<WindowSize>({ width: 0, height: 0 });
  const resizeStart = useRef<{ pointerX: number; pointerY: number; size: WindowSize } | null>(null);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // An expanded window is pinned to the desktop; the title-bar buttons handle
    // their own clicks and must not start a drag.
    if (expanded || event.target instanceof HTMLButtonElement) {
      return;
    }
    const rect = windowRef.current?.getBoundingClientRect();
    dragSize.current = rect ? { width: rect.width, height: rect.height } : { width: 0, height: 0 };
    dragOffset.current = { x: event.clientX - position.x, y: event.clientY - position.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragOffset.current) {
      return;
    }
    setPosition(
      clampToDesktop(
        { x: event.clientX - dragOffset.current.x, y: event.clientY - dragOffset.current.y },
        dragSize.current,
      ),
    );
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragOffset.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleResizePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Don't let this bubble into the window's own onPointerDownCapture-driven
    // drag/focus handling as a title-bar drag start — it already runs onFocus
    // via the capture phase, which is fine; this just keeps resize and move
    // from fighting over the same gesture.
    event.stopPropagation();
    const rect = windowRef.current?.getBoundingClientRect();
    resizeStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      size: rect ? { width: rect.width, height: rect.height } : { width: MIN_WIDTH, height: MIN_HEIGHT },
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleResizePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = resizeStart.current;
    if (!start) {
      return;
    }
    // Also never resize past the desktop's own edge, given where the window
    // currently sits.
    const maxWidth = window.innerWidth - position.x;
    const maxHeight = window.innerHeight - position.y;
    setManualSize({
      width: Math.min(maxWidth, Math.max(MIN_WIDTH, start.size.width + (event.clientX - start.pointerX))),
      height: Math.min(maxHeight, Math.max(MIN_HEIGHT, start.size.height + (event.clientY - start.pointerY))),
    });
  };

  const stopResizing = (event: ReactPointerEvent<HTMLDivElement>) => {
    resizeStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  // Zoom toggles between the caller's size (or the last manual resize, if any)
  // at the last dragged position and a near-full-desktop box; restoring drops
  // the window back exactly where — and how big — it was.
  const autoHeight = height === "auto" && !manualSize;
  const geometry: React.CSSProperties = expanded
    ? {
        zIndex: z,
        top: MENU_BAR_OFFSET,
        left: EXPANDED_INSET,
        width: `calc(100vw - ${EXPANDED_INSET * 2}px)`,
        height: `calc(100vh - ${MENU_BAR_OFFSET + EXPANDED_INSET}px)`,
      }
    : {
        zIndex: z,
        top: position.y,
        left: position.x,
        width: manualSize ? `${manualSize.width}px` : width,
        // "auto" sizes to content but never taller than the desktop, unless the
        // user has manually resized — then their pixel height wins outright.
        ...(autoHeight
          ? { maxHeight: `calc(100vh - ${MENU_BAR_OFFSET + EXPANDED_INSET * 2}px)` }
          : { height: manualSize ? `${manualSize.height}px` : height }),
      };

  const contentStyle: React.CSSProperties = padded
    ? { flex: "0 1 auto", overflow: "auto", padding: "1rem" }
    : { flex: 1, display: "flex", overflow: "hidden" };

  return (
    <StyledDesktopWindow ref={windowRef} className="window" style={geometry} onPointerDownCapture={onFocus}>
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
      <StyledContent style={contentStyle}>{children}</StyledContent>
      {!expanded && (
        <StyledResizeHandle
          onPointerDown={handleResizePointerDown}
          onPointerMove={handleResizePointerMove}
          onPointerUp={stopResizing}
        />
      )}
    </StyledDesktopWindow>
  );
}
