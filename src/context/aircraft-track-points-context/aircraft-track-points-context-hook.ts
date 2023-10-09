import { useContext } from "react";
import { AircraftTrackPointsContext } from "context/aircraft-track-points-context/aircraft-track-points-context.tsx";

export const useAircraftTrackPointsContext = () => useContext(AircraftTrackPointsContext);
