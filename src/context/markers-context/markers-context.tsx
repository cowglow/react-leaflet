import { createContext } from "react";

const defaultValues: MarkersContextApi = {
  markers: [],
  addMarker: () => {
    throw Error("ERROR:: Add MarkerDefault | Uninitialized");
  },
  clearMarkers: () => {
    throw Error("ERROR:: Clear Markers | Uninitialized");
  },
  removeMarker: () => {
    throw Error("ERROR:: Remove MarkerDefault | Uninitialized");
  }
};

export const MarkersContext = createContext<MarkersContextApi>(defaultValues);
