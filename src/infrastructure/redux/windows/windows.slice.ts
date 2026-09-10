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
};

export type WindowsSliceState = {
  items: WindowInstance[];
};

const initialState: WindowsSliceState = {
  items: [],
};

const windowsSlice = createSlice({
  name: "windows",
  initialState,
  reducers: {
    // One live window per type — opening the same type again replaces its
    // payload instead of stacking a second instance, so `id` is just `type`.
    openWindow(state, action: PayloadAction<{ type: DialogType; payload?: DialogPayload | null }>) {
      const { type, payload = null } = action.payload;
      const items = state.items.filter((window) => window.id !== type);
      return { ...state, items: [...items, { id: type, type, payload }] };
    },
    closeWindow(state, action: PayloadAction<string>) {
      return { ...state, items: state.items.filter((window) => window.id !== action.payload) };
    },
  },
});

export const { openWindow, closeWindow } = windowsSlice.actions;
export default windowsSlice.reducer;
