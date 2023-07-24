import { createContext } from "react";

const defaultValues: MarkersContextApi = {
  markers: [],
  addMarker: () => {
    throw Error("ERROR:: Add Marker | Uninitialized");
  },
  clearMarkers: () => {
    throw Error("ERROR:: Clear Markers | Uninitialized");
  }
};

export const MarkerContext = createContext<MarkersContextApi>(defaultValues);
