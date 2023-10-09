import { ReactNode } from "react";
import { AircraftTrackPointsContext } from "./aircraft-track-points-context.tsx";
import { useLocalStorage } from "hooks/use-local-storage.ts";


interface AircraftTrackPointsContextProviderProps {
  children: ReactNode;
}

export const AircraftTrackPointsContextProvider = ({
                                                     children
                                                   }: AircraftTrackPointsContextProviderProps) => {
  const [trackPoints, setTrackPoints] = useLocalStorage<L.LatLng[]>({
    key: "TRACK_POINTS",
    defaultValue: []
  });

  const addTrackPoint = ({ lat, lng }: L.LatLng) => {
    setTrackPoints((prevState: L.LatLng[]) => [
      ...prevState,
      new L.LatLng(lat, lng)
    ]);
  };

  const clearTrackPoints = () => {
    setTrackPoints([]);
  };

  return (
    <AircraftTrackPointsContext.Provider value={{ trackPoints, addTrackPoint, clearTrackPoints }}>
      {children}
    </AircraftTrackPointsContext.Provider>
  );
};
