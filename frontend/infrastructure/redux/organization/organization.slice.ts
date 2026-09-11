import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Organization } from "domain/organization/organization.types.ts";
import type { MutationStatus } from "infrastructure/redux/mutation-status.ts";

export type OrganizationSliceState = {
  items: Organization[];
  loading: boolean;
  error: string | null;
  mutationRequestId: string | null;
  mutationStatus: MutationStatus;
  mutationError: string | null;
};

const initialState: OrganizationSliceState = {
  items: [],
  loading: false,
  error: null,
  mutationRequestId: null,
  mutationStatus: "idle",
  mutationError: null,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    fetchOrganizationsRequested(state) {
      return { ...state, loading: true, error: null };
    },
    fetchOrganizationsSucceeded(state, action: PayloadAction<Organization[]>) {
      return { ...state, loading: false, items: action.payload };
    },
    fetchOrganizationsFailed(state, action: PayloadAction<string>) {
      return { ...state, loading: false, error: action.payload };
    },
    addOrganizationRequested(
      state,
      action: PayloadAction<{ requestId: string; organization: Organization }>,
    ) {
      return {
        ...state,
        mutationRequestId: action.payload.requestId,
        mutationStatus: "pending",
        mutationError: null,
      };
    },
    addOrganizationSucceeded(
      state,
      action: PayloadAction<{ requestId: string; organization: Organization }>,
    ) {
      return {
        ...state,
        items: [...state.items, action.payload.organization],
        mutationRequestId: action.payload.requestId,
        mutationStatus: "succeeded",
      };
    },
    organizationMutationFailed(
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
    resetOrganizationMutation(state) {
      return { ...state, mutationRequestId: null, mutationStatus: "idle", mutationError: null };
    },
  },
});

export const {
  fetchOrganizationsRequested,
  fetchOrganizationsSucceeded,
  fetchOrganizationsFailed,
  addOrganizationRequested,
  addOrganizationSucceeded,
  organizationMutationFailed,
  resetOrganizationMutation,
} = organizationSlice.actions;
export default organizationSlice.reducer;
