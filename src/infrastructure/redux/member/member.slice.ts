import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "infrastructure/api/api-client.ts";
import type { Member } from "domain/member/member.types.ts";

export type MemberSliceState = {
  items: Member[];
  filteredLimit: number;
  loading: boolean;
  error: string | null;
};

const initialState: MemberSliceState = {
  items: [],
  filteredLimit: 0,
  loading: false,
  error: null,
};

export const fetchMembers = createAsyncThunk("member/fetch", async () => {
  const { members } = await apiFetch<{ members: Member[] }>("/members");
  return members;
});

export const addMember = createAsyncThunk("member/add", async (member: Member) => {
  const { member: created } = await apiFetch<{ member: Member }>("/members", {
    method: "POST",
    body: JSON.stringify(member),
  });
  return created;
});

export const updateMember = createAsyncThunk("member/update", async (member: Member) => {
  const { member: updated } = await apiFetch<{ member: Member }>(`/members/${member.id}`, {
    method: "PUT",
    body: JSON.stringify(member),
  });
  return updated;
});

export const removeMember = createAsyncThunk("member/remove", async (id: string) => {
  await apiFetch(`/members/${id}`, { method: "DELETE" });
  return id;
});

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<number>) {
      return { ...state, filteredLimit: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => ({ ...state, loading: true, error: null }))
      .addCase(fetchMembers.fulfilled, (state, action: PayloadAction<Member[]>) => ({
        ...state,
        loading: false,
        items: action.payload,
        filteredLimit: action.payload.length,
      }))
      .addCase(fetchMembers.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.error.message ?? "Failed to load members",
      }))
      .addCase(addMember.fulfilled, (state, action: PayloadAction<Member>) => ({
        ...state,
        items: [...state.items, action.payload],
        filteredLimit: state.filteredLimit + 1,
      }))
      .addCase(updateMember.fulfilled, (state, action: PayloadAction<Member>) => ({
        ...state,
        items: state.items.map((item) => (item.id === action.payload.id ? action.payload : item)),
      }))
      .addCase(removeMember.fulfilled, (state, action: PayloadAction<string>) => ({
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }));
  },
});

export const { setFilter } = memberSlice.actions;
export default memberSlice.reducer;
