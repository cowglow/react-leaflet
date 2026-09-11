import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Member } from "domain/member/member.types.ts";
import type { MutationStatus } from "infrastructure/redux/mutation-status.ts";

export type ImportResult = { success: number; total: number; failed: number };

export type MemberSliceState = {
  items: Member[];
  filteredLimit: number;
  loading: boolean;
  error: string | null;
  // A single in-flight add/update/remove at a time is all this app's UI ever
  // produces (one form, or one dragged marker) — see MemberForm.tsx and
  // Marker.Member.tsx for how `mutationRequestId` lets each caller tell its own
  // request's outcome apart from anyone else's.
  mutationRequestId: string | null;
  mutationStatus: MutationStatus;
  mutationError: string | null;
  importResult: ImportResult | null;
};

const initialState: MemberSliceState = {
  items: [],
  filteredLimit: 0,
  loading: false,
  error: null,
  mutationRequestId: null,
  mutationStatus: "idle",
  mutationError: null,
  importResult: null,
};

const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<number>) {
      return { ...state, filteredLimit: action.payload };
    },
    fetchMembersRequested(state) {
      return { ...state, loading: true, error: null };
    },
    fetchMembersSucceeded(state, action: PayloadAction<Member[]>) {
      return {
        ...state,
        loading: false,
        items: action.payload,
        filteredLimit: action.payload.length,
      };
    },
    fetchMembersFailed(state, action: PayloadAction<string>) {
      return { ...state, loading: false, error: action.payload };
    },
    addMemberRequested(
      state,
      action: PayloadAction<{ requestId: string; member: Member }>,
    ) {
      return {
        ...state,
        mutationRequestId: action.payload.requestId,
        mutationStatus: "pending",
        mutationError: null,
      };
    },
    updateMemberRequested(
      state,
      action: PayloadAction<{ requestId: string; member: Member }>,
    ) {
      return {
        ...state,
        mutationRequestId: action.payload.requestId,
        mutationStatus: "pending",
        mutationError: null,
      };
    },
    removeMemberRequested(
      state,
      action: PayloadAction<{ requestId: string; id: string }>,
    ) {
      return {
        ...state,
        mutationRequestId: action.payload.requestId,
        mutationStatus: "pending",
        mutationError: null,
      };
    },
    addMemberSucceeded(
      state,
      action: PayloadAction<{ requestId: string; member: Member }>,
    ) {
      return {
        ...state,
        items: [...state.items, action.payload.member],
        filteredLimit: state.filteredLimit + 1,
        mutationRequestId: action.payload.requestId,
        mutationStatus: "succeeded",
      };
    },
    updateMemberSucceeded(
      state,
      action: PayloadAction<{ requestId: string; member: Member }>,
    ) {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.member.id ? action.payload.member : item,
        ),
        mutationRequestId: action.payload.requestId,
        mutationStatus: "succeeded",
      };
    },
    removeMemberSucceeded(
      state,
      action: PayloadAction<{ requestId: string; id: string }>,
    ) {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
        mutationRequestId: action.payload.requestId,
        mutationStatus: "succeeded",
      };
    },
    memberMutationFailed(
      state,
      action: PayloadAction<{ requestId: string; error: string }>,
    ) {
      return {
        ...state,
        mutationRequestId: action.payload.requestId,
        mutationStatus: "failed",
        mutationError: action.payload.error,
      };
    },
    resetMemberMutation(state) {
      return { ...state, mutationRequestId: null, mutationStatus: "idle", mutationError: null };
    },
    // Import replaces the directory wholesale (see member.saga.ts's importMembersSaga)
    // — this reducer itself is a no-op, the saga drives per-row add/remove actions and
    // reports the aggregate outcome via importMembersCompleted below.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    importMembersRequested(state, _action: PayloadAction<{ members: Member[] }>) {
      return state;
    },
    importMembersCompleted(state, action: PayloadAction<ImportResult>) {
      return { ...state, importResult: action.payload };
    },
    clearImportResult(state) {
      return { ...state, importResult: null };
    },
  },
});

export const {
  setFilter,
  fetchMembersRequested,
  fetchMembersSucceeded,
  fetchMembersFailed,
  addMemberRequested,
  updateMemberRequested,
  removeMemberRequested,
  addMemberSucceeded,
  updateMemberSucceeded,
  removeMemberSucceeded,
  memberMutationFailed,
  resetMemberMutation,
  importMembersRequested,
  importMembersCompleted,
  clearImportResult,
} = memberSlice.actions;
export default memberSlice.reducer;
