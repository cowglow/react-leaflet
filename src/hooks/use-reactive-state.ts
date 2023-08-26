import { makeVar, ReactiveVar } from "@apollo/client";


type MarkerMode = "POINT" | "POLYGON"
type MarkerType = "DEFAULT" | "CUSTOM"

interface ReactiveStateApi {
  markerMode: ReactiveVar<MarkerMode>;
  markerType: ReactiveVar<MarkerType>;
}

export const useReactiveState = (): ReactiveStateApi => {
  const markerMode = makeVar<MarkerMode>("POINT");
  const markerType = makeVar<MarkerType>("DEFAULT");

  return {
    markerMode,
    markerType
  };
};