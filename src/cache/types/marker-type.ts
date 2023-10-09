import { makeVar } from "@apollo/client";

type MarkerType = "AIRCRAFT" | "CUSTOM" | "DEFAULT"

export const markerType = makeVar<MarkerType>("AIRCRAFT");

export const markerCache = {
  marker: {
    read() {
      return markerType;
    }
  }
};