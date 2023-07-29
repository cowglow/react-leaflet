const API_GATEWAY = "https://randomuser.me/api/?inc=location";


export const useCoordinates = () => {

  const getRandomCoordinate = async () => {
    try {
      const data = await fetch(`${API_GATEWAY}&results=1`).then(res => res.json());
      const { latitude, longitude } = data.results[0].location.coordinates;
      return new L.LatLng(latitude, longitude);
    } catch (error) {
      console.error("Fetch Error!! ", error);
    }
  };

  const getRandomCoordinates = async () => {
    try {
      const data = await fetch(`${API_GATEWAY}&results=10`).then(res => res.json());
      return data.results.map(({ location }) => {
        const { latitude, longitude } = location.coordinates;
        return new L.LatLng(latitude, longitude);
      });
    } catch (error) {
      console.log("Fetch Error!! ", error);
    }
  };

  return {
    getRandomCoordinate,
    getRandomCoordinates
  };
};