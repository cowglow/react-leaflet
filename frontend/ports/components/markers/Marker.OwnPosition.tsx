import { Marker } from "@vis.gl/react-maplibre";
import { useEffect, useState } from "react";
import "./Marker.OwnPosition.css";

const DEFAULT_POSITION = { lng: 11.0767, lat: 49.4521 };

// Shows where you are. It never moves the camera — MapBounds frames everyone on
// load, and after that the map belongs to the user and to SelectionCamera.
export default function MarkerOwnPosition() {
  const [position, setPosition] = useState<{ lng: number; lat: number } | null>(DEFAULT_POSITION);

  useEffect(() => {
    // Once we have a real fix, a later transient error (signal blip, one slow
    // poll) shouldn't yank the marker back to the Nuremberg fallback - only
    // fall back if we never got a real position in the first place.
    let gotRealPosition = false;
    const watchId = navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        gotRealPosition = true;
        setPosition({ lng: longitude, lat: latitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (!gotRealPosition) {
          setPosition(DEFAULT_POSITION);
        }
      },
      // enableHighAccuracy asks for a GPS-grade fix, which desktops/laptops
      // without real GPS hardware often can't deliver within a short timeout -
      // it times out and falls back here every time. Wi-Fi/IP-based location
      // (the same kind Google Maps uses on a laptop) is plenty accurate for a
      // map pin and responds far more reliably.
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 10_000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!position) {
    return null;
  }

  return (
    <Marker longitude={position.lng} latitude={position.lat} anchor="center">
      <div className="own-position-marker" aria-hidden="true" />
    </Marker>
  );
}
