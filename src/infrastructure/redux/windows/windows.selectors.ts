import type { RootState } from "infrastructure/redux/store.ts";
import type { WindowInstance } from "infrastructure/redux/windows/windows.slice.ts";

export function getOpenWindows(state: RootState): WindowInstance[] {
  return state.windows.items;
}

export function isWindowOpen(state: RootState, id: string): boolean {
  return state.windows.items.some((window) => window.id === id);
}
