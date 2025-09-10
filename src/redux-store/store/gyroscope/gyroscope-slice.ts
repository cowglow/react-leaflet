import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GyroscopeSliceState = {
  enabled: boolean;
  alpha: number;
};

const initialState: GyroscopeSliceState = {
  enabled: false,
  alpha: 0,
};

const gyroscopeSlice = createSlice({
  name: "gyroscope",
  initialState,
  reducers: {
    enableGyroscope(state) {
      return { ...state, enabled: true };
    },
    disableGyroscope(state) {
      return { ...state, enabled: false, alpha: 0 };
    },
    setAlpha(state, action: PayloadAction<number>) {
      return { ...state, alpha: action.payload };
    },
  },
});

export const { enableGyroscope, disableGyroscope, setAlpha } =
  gyroscopeSlice.actions;

export default gyroscopeSlice.reducer;
