import { createContext } from "react";

const defaultValues: AircraftTrackPointsContextApi = {
  trackPoints: [],
  addTrackPoint: () => {
    throw Error("Error:: Add Track Point | Uninitialized");
  },
  clearTrackPoints: () => {
    throw Error("Error:: Clear Track Points | Uninitialized");
  }
};

export const AircraftTrackPointsContext = createContext<AircraftTrackPointsContextApi>(defaultValues);