import { Marker, useMap } from "@vis.gl/react-maplibre";
import { useEffect, useState } from "react";

const DEFAULT_POSITION = { lng: 11.0767, lat: 49.4521 };

export default function MarkerOwnPosition() {
  const { current: map } = useMap();
  const [position, setPosition] = useState<{ lng: number; lat: number } | null>(DEFAULT_POSITION);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      ({ coords: { latitude, longitude } }) => {
        setPosition({ lng: longitude, lat: latitude });
        map?.easeTo({ center: [longitude, latitude], zoom: 12 });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setPosition(DEFAULT_POSITION);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  if (!position) {
    return null;
  }

  return <Marker longitude={position.lng} latitude={position.lat} />;
}
