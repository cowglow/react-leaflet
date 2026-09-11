import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// The current selection is always a set of member ids. Selecting an organization
// just means selecting all of its members — the map never needs to know about
// organizations. Both the map markers and the organization tree read and write
// this slice, so the two views stay in sync with no extra plumbing.
export type SelectionState = {
  memberIds: string[];
};

const initialState: SelectionState = { memberIds: [] };

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    selectMembers(state, action: PayloadAction<string[]>) {
      const next = [...new Set(action.payload)];
      // Re-selecting the same set is a no-op — return the identical state so
      // downstream effects (the camera) don't re-fire.
      const sortedNext = [...next].sort();
      const sortedCurrent = [...state.memberIds].sort();
      if (
        sortedNext.length === sortedCurrent.length &&
        sortedNext.every((id, index) => id === sortedCurrent[index])
      ) {
        return state;
      }
      return { memberIds: next };
    },
    toggleMember(state, action: PayloadAction<string>) {
      const id = action.payload;
      return {
        memberIds: state.memberIds.includes(id)
          ? state.memberIds.filter((memberId) => memberId !== id)
          : [...state.memberIds, id],
      };
    },
    clearSelection() {
      return { memberIds: [] };
    },
  },
});

export const { selectMembers, toggleMember, clearSelection } = selectionSlice.actions;
export default selectionSlice.reducer;
