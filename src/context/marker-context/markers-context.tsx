import { createContext } from "react";

const defaultValues: MarkersContextApi = {
  markers: [],
  addMarker: () => {
    throw Error("ERROR:: Add Marker | Uninitialized");
  },
};

export const MarkerContext = createContext<MarkersContextApi>(defaultValues);
