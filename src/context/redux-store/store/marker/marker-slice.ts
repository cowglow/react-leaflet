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
    openFileDone(state) {
      return { ...state, loading: false };
    },
    openFileError(state, action: PayloadAction<Error>) {
      return { ...state, loading: false, error: action.payload };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    saveFile(state, _action: PayloadAction<{ filename: string }>) {
      return { ...state };
    },
    // saveFileDone(state) {},
    // saveFileError(state) {},
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
  addMarker,
  setEnabled,
  clearAllMarkers,
} = markerSlice.actions;

export default markerSlice.reducer;
