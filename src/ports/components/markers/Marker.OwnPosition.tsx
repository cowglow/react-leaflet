import { Marker } from "@vis.gl/react-maplibre";
import { useEffect, useState } from "react";

const DEFAULT_POSITION = { lng: 11.0767, lat: 49.4521 };

// Shows where you are. It never moves the camera — MapBounds frames everyone on
// load, and after that the map belongs to the user and to SelectionCamera.
export default function MarkerOwnPosition() {
  const [position, setPosition] = useState<{ lng: number; lat: number } | null>(DEFAULT_POSITION);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        setPosition({ lng: longitude, lat: latitude });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setPosition(DEFAULT_POSITION);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  if (!position) {
    return null;
  }

  return <Marker longitude={position.lng} latitude={position.lat} />;
}
