import { Marker } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

export default function MarkerOwnPosition() {
  const defaultPosition = new L.LatLng(49.4521, 11.0767);
  const [position, setPosition] = useState<L.LatLng | null>(defaultPosition);

  useEffect(() => {
    const geolocation = navigator.geolocation.watchPosition(
      (success) => {
        const { latitude, longitude } = success.coords;
        setPosition(new L.LatLng(latitude, longitude));
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Fallback
        setPosition(defaultPosition);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    );
    return () => {
      return navigator.geolocation.clearWatch(geolocation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Marker position={position} />;
}
