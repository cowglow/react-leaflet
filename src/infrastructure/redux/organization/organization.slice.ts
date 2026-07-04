import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "infrastructure/api/api-client.ts";
import type { Organization } from "domain/organization/organization.types.ts";

export type OrganizationSliceState = {
  items: Organization[];
  loading: boolean;
  error: string | null;
};

const initialState: OrganizationSliceState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchOrganizations = createAsyncThunk("organization/fetch", async () => {
  const { organizations } = await apiFetch<{ organizations: Organization[] }>("/organizations");
  return organizations;
});

export const addOrganization = createAsyncThunk(
  "organization/add",
  async (organization: Organization) => {
    const { organization: created } = await apiFetch<{ organization: Organization }>(
      "/organizations",
      { method: "POST", body: JSON.stringify(organization) },
    );
    return created;
  },
);

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => ({ ...state, loading: true, error: null }))
      .addCase(
        fetchOrganizations.fulfilled,
        (state, action: PayloadAction<Organization[]>) => ({
          ...state,
          loading: false,
          items: action.payload,
        }),
      )
      .addCase(fetchOrganizations.rejected, (state, action) => ({
        ...state,
        loading: false,
        error: action.error.message ?? "Failed to load organizations",
      }))
      .addCase(addOrganization.fulfilled, (state, action: PayloadAction<Organization>) => ({
        ...state,
        items: [...state.items, action.payload],
      }));
  },
});

export default organizationSlice.reducer;
