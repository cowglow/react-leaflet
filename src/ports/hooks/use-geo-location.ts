import { useEffect, useState } from "react";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

interface UseGeoLocationResult {
  location: GeoCoordinate | null;
  error: string | null;
  loading: boolean;
}

export default function useGeoLocation(): UseGeoLocationResult {
  const [location, setLocation] = useState<GeoCoordinate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
      setLoading(false);
    };

    const errorHandler = (err: GeolocationPositionError) => {
      setError(err.message);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      timeout: 10000,
    });
  }, []);

  return { location, error, loading };
}
