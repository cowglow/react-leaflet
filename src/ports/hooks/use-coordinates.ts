import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

const API_GATEWAY = "https://randomuser.me/api/?inc=location";

export const useCoordinates = () => {
  const getRandomCoordinate = async (): Promise<GeoCoordinate | undefined> => {
    try {
      const data = await fetch(`${API_GATEWAY}&results=1`).then((res) => res.json());
      const { latitude, longitude } = data.results[0].location.coordinates;
      return { lat: Number(latitude), lng: Number(longitude) };
    } catch (error) {
      console.error("Fetch Error!! ", error);
    }
  };

  const getRandomCoordinates = async (): Promise<GeoCoordinate[] | undefined> => {
    try {
      const data = await fetch(`${API_GATEWAY}&results=10`).then((res) => res.json());
      return data.results.map(({ location }) => {
        const { latitude, longitude } = location.coordinates;
        return { lat: Number(latitude), lng: Number(longitude) };
      });
    } catch (error) {
      console.log("Fetch Error!! ", error);
    }
  };

  return { getRandomCoordinate, getRandomCoordinates };
};