import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

export type MarkerSliceState = {
  error: Error | null;
  filteredLimit: number;
  items: GeoCoordinate[];
  loading: boolean;
};

const initialState: MarkerSliceState = {
  error: null,
  filteredLimit: 0,
  items: [],
  loading: false,
};

const markerSlice = createSlice({
  name: "markers",
  initialState,
  reducers: {
    openFile(state) {
      return { ...state, loading: true };
    },
    openFileDone(state, action: PayloadAction<Pick<MarkerSliceState, "items">>) {
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        filteredLimit: action.payload.items.length,
      };
    },
    openFileError(state, action: PayloadAction<Error>) {
      return { ...state, loading: false, error: action.payload };
    },
    saveFile(state) {
      return { ...state, loading: true };
    },
    saveFileDone(state) {
      return { ...state, loading: false };
    },
    saveFileError(state, action: PayloadAction<Error>) {
      return { ...state, loading: false, error: action.payload };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addMarker(state, _action: PayloadAction<GeoCoordinate>) {
      return { ...state, loading: true };
    },
    removeMarker(state, action: PayloadAction<GeoCoordinate>) {
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.lat === action.payload.lat && item.lng === action.payload.lng),
        ),
      };
    },
    addMarkerSuccess(state, action: PayloadAction<GeoCoordinate>) {
      return {
        ...state,
        loading: false,
        items: [...state.items, action.payload],
      };
    },
    addMarkerError(state, action: PayloadAction<Error>) {
      return { ...state, loading: false, error: action.payload };
    },
    clearAllMarkers(state) {
      return { ...state, items: [] };
    },
    setFilter(state, action: PayloadAction<number>) {
      return { ...state, filteredLimit: action.payload };
    },
  },
});

export const {
  openFile,
  openFileDone,
  openFileError,
  saveFile,
  saveFileDone,
  saveFileError,
  addMarker,
  removeMarker,
  addMarkerSuccess,
  addMarkerError,
  clearAllMarkers,
  setFilter,
} = markerSlice.actions;

export default markerSlice.reducer;