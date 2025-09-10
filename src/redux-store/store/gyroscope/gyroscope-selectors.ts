import { RootState } from "redux-store/store.ts";

export function getGyroscopeAlpha(state: RootState): number {
  return state.gyroscope.alpha;
}

export function getGyroscopeEnabled(state: RootState): boolean {
  return state.gyroscope.enabled;
}
