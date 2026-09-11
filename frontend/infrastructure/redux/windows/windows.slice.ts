import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

export type DialogType =
  | "MEMBER_DIALOG"
  | "ORGANIZATION_DIALOG"
  | "INVITE_DIALOG"
  | "ORGANIZATION_TREE_DIALOG"
  | "MAP_DIALOG";

export type DialogPayload = {
  coordinates?: GeoCoordinate;
  memberId?: string;
};

export type WindowInstance = {
  id: string;
  type: DialogType;
  payload: DialogPayload | null;
  // Stacking order for the floating DesktopWindows. Sits between the desktop and
  // the menu bar (1000); modal backdrops (2000) are always above.
  z?: number;
};

export type WindowsSliceState = {
  items: WindowInstance[];
};

const initialState: WindowsSliceState = {
  items: [],
};

const BASE_Z = 100;

// Reassign every window's `z` by current stacking order, with `frontId` on top.
// Renormalising each time keeps the values bounded no matter how often windows
// are cycled, and never reorders `items` itself (moving the map's DOM node
// around would disturb its WebGL canvas).
function restack(items: WindowInstance[], frontId: string): WindowInstance[] {
  const order = [...items]
    .sort((a, b) => (a.z ?? BASE_Z) - (b.z ?? BASE_Z))
    .map((window) => window.id)
    .filter((id) => id !== frontId);
  order.push(frontId);
  return items.map((window) => ({ ...window, z: BASE_Z + order.indexOf(window.id) }));
}

const windowsSlice = createSlice({
  name: "windows",
  initialState,
  reducers: {
    // One live window per type — opening the same type again replaces its
    // payload instead of stacking a second instance, so `id` is just `type`.
    // A (re)opened window comes to the front.
    openWindow(state, action: PayloadAction<{ type: DialogType; payload?: DialogPayload | null }>) {
      const { type, payload = null } = action.payload;
      const kept = state.items.filter((window) => window.id !== type);
      return { ...state, items: restack([...kept, { id: type, type, payload }], type) };
    },
    closeWindow(state, action: PayloadAction<string>) {
      return { ...state, items: state.items.filter((window) => window.id !== action.payload) };
    },
    bringToFront(state, action: PayloadAction<string>) {
      const target = state.items.find((window) => window.id === action.payload);
      if (!target) {
        return state;
      }
      const maxZ = Math.max(...state.items.map((window) => window.z ?? BASE_Z));
      if ((target.z ?? BASE_Z) >= maxZ) {
        return state; // already on top
      }
      return { ...state, items: restack(state.items, action.payload) };
    },
  },
});

export const { openWindow, closeWindow, bringToFront } = windowsSlice.actions;
export default windowsSlice.reducer;
