import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Member } from "domain/member/member.types.ts";

export type MemberSliceState = {
  items: Member[];
  filteredLimit: number;
};

const initialState: MemberSliceState = {
  items: [],
  filteredLimit: 0,
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    addMember(state, action: PayloadAction<Member>) {
      return {
        ...state,
        items: [...state.items, action.payload],
        filteredLimit: state.filteredLimit + 1,
      };
    },
    updateMember(state, action: PayloadAction<Member>) {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    },
    removeMember(state, action: PayloadAction<string>) {
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    },
    setFilter(state, action: PayloadAction<number>) {
      return { ...state, filteredLimit: action.payload };
    },
    loadMembers(state, action: PayloadAction<Member[]>) {
      return { ...state, items: action.payload, filteredLimit: action.payload.length };
    },
  },
});

export const { addMember, updateMember, removeMember, setFilter, loadMembers } =
  memberSlice.actions;

export default memberSlice.reducer;
