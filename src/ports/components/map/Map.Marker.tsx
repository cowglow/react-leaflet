import { ReactNode, useState } from "react";
import { Marker, Popup } from "@vis.gl/react-maplibre";

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
  children?: ReactNode;
}

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
  children,
}: MapMarkerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Marker
        // react-maplibre only reads `color`/`scale` when it first creates the
        // maplibre Marker; remount when either changes (e.g. an incomplete pin
        // being completed).
        key={`${color ?? ""}-${scale ?? ""}`}
        longitude={longitude}
        latitude={latitude}
        anchor="bottom"
        color={color}
        scale={scale}
        onClick={(event) => {
          event.originalEvent.stopPropagation();
          if (onActivate) {
            onActivate();
          } else {
            setOpen((value) => !value);
          }
        }}
      />
      {open && children && (
        <Popup
          longitude={longitude}
          latitude={latitude}
          anchor="bottom"
          offset={28}
          onClose={() => setOpen(false)}
        >
          {children}
        </Popup>
      )}
    </>
  );
}
