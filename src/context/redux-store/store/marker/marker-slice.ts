import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MarkerSliceState = {
  enabled: boolean;
  items: L.LatLng[];
  loading: boolean;
  error: Error | null;
};

const initialState: MarkerSliceState = {
  enabled: true,
  items: [],
  loading: false,
  error: null,
};

const markerSlice = createSlice({
  name: "markers",
  initialState,
  reducers: {
    openFile(state) {
      return { ...state, loading: true };
    },
    openFileDone(
      state,
      action: PayloadAction<Pick<MarkerSliceState, "items">>,
    ) {
      return { ...state, loading: false, items: action.payload.items };
    },
    openFileError(state, action: PayloadAction<Error>) {
      return { ...state, loading: false, error: action.payload };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    saveFile(state) {
      return { ...state, loading: true };
    },
    saveFileDone(state) {
      return { ...state, loading: false };
    },
    saveFileError(state, action: PayloadAction<Error>) {
      return { ...state, loading: false, error: action.payload };
    },
    addMarker(state, action: PayloadAction<L.LatLng>) {
      return { ...state, items: [...state.items, action.payload] };
    },
    setEnabled(state, action: PayloadAction<boolean>) {
      return { ...state, enabled: action.payload };
    },
    clearAllMarkers(state) {
      return { ...state, items: [] };
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
  setEnabled,
  clearAllMarkers,
} = markerSlice.actions;

export default markerSlice.reducer;
