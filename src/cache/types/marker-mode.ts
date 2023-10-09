import { makeVar } from "@apollo/client";

type MarkerMode = "POINT" | "POLYGON"

export const markerMode = makeVar<MarkerMode>("POINT");

export const modeCache = {
  mode: {
    read() {
      return markerMode;
    }
  }
};