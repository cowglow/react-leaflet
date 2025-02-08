import { createContext } from "react";
import { MarkersContextApi } from "context/markers-context/markers-context.type.ts";

const defaultValues: MarkersContextApi = {
  markers: [],
  enable: false,
  addMarker: () => {
    throw Error("ERROR:: Add MarkerDefault | Uninitialized");
  },
  clearMarkers: () => {
    throw Error("ERROR:: Clear Markers | Uninitialized");
  },
  removeMarker: () => {
    throw Error("ERROR:: Remove MarkerDefault | Uninitialized");
  },
  setEnable: () => {
    throw Error("ERROR:: Set Enable | Uninitialized");
  },
};

export const MarkersContext = createContext<MarkersContextApi>(defaultValues);
