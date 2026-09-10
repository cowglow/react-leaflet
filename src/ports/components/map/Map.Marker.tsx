import { ReactNode, useState } from "react";
import { Marker, Popup } from "@vis.gl/react-maplibre";

interface MapMarkerProps {
  longitude: number;
  latitude: number;
  children?: ReactNode;
}

// A default MapLibre pin that toggles a popup (its `children`) on click. The
// marker's DOM click otherwise bubbles to the map canvas — which fires the map's
// own `click` (closing the popup via `closeOnClick`, and triggering
// click-to-add-member) — so stop it at the marker, matching Leaflet's behaviour.
export default function MapMarker({ longitude, latitude, children }: MapMarkerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Marker
        longitude={longitude}
        latitude={latitude}
        anchor="bottom"
        onClick={(event) => {
          event.originalEvent.stopPropagation();
          setOpen((value) => !value);
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
