import { ReactNode, useState } from "react";
import { Marker, Popup } from "@vis.gl/react-maplibre";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

interface MapMarkerProps {
  longitude: number;
  latitude: number;
  /** Pin colour; defaults to MapLibre's built-in teal. */
  color?: string;
  /** Pin scale relative to the default. */
  scale?: number;
  /**
   * When set, a marker click calls this instead of toggling the popup — used for
   * incomplete markers, which jump straight to the edit form.
   */
  onActivate?: () => void;
  /**
   * When set, the popup gets a "Move" button; clicking it makes the pin
   * draggable, and dropping it calls this with the new coordinates. Clicking the
   * pin without dragging cancels the move.
   */
  onMoveEnd?: (coordinates: { lat: number; lng: number }) => void;
  /** Highlight the pin as selected. */
  selected?: boolean;
  /** Called on a marker click; `multi` is true when a modifier key was held. */
  onSelect?: (multi: boolean) => void;
  children?: ReactNode;
}

const MOVING_COLOR = "#2e9e4f";
const SELECTED_COLOR = "#e5484d";

// A default MapLibre pin. The marker's DOM click otherwise bubbles to the map
// canvas — which fires the map's own `click` (closing the popup via
// `closeOnClick`, and triggering click-to-add-member) — so stop it at the
// marker, matching Leaflet's behaviour.
export default function MapMarker({
  longitude,
  latitude,
  color,
  scale,
  onActivate,
  onMoveEnd,
  selected,
  onSelect,
  children,
}: MapMarkerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [moving, setMoving] = useState(false);

  const effectiveColor = moving ? MOVING_COLOR : selected ? SELECTED_COLOR : color;
  const effectiveScale = selected ? (scale ?? 1) * 1.2 : scale;

  return (
    <>
      <Marker
        // react-maplibre only reads `color`/`scale` when it first creates the
        // maplibre Marker; remount when either changes (incomplete pin being
        // completed, or a pin entering/leaving move mode).
        key={`${effectiveColor ?? ""}-${effectiveScale ?? ""}`}
        longitude={longitude}
        latitude={latitude}
        anchor="bottom"
        color={effectiveColor}
        scale={effectiveScale}
        draggable={moving}
        onDragEnd={(event) => {
          setMoving(false);
          onMoveEnd?.({ lat: event.lngLat.lat, lng: event.lngLat.lng });
        }}
        onClick={(event) => {
          event.originalEvent.stopPropagation();
          if (moving) {
            setMoving(false); // clicked without dragging → cancel the move
            return;
          }
          onSelect?.(event.originalEvent.shiftKey || event.originalEvent.metaKey);
          if (onActivate) {
            onActivate();
          } else {
            setOpen((value) => !value);
          }
        }}
      />
      {open && !moving && children && (
        <Popup
          longitude={longitude}
          latitude={latitude}
          anchor="bottom"
          offset={28}
          onClose={() => setOpen(false)}
        >
          {children}
          {onMoveEnd && (
            <>
              <br />
              <button
                className="btn"
                onClick={() => {
                  setOpen(false);
                  setMoving(true);
                }}
              >
                {t.common.move}
              </button>
            </>
          )}
        </Popup>
      )}
    </>
  );
}
