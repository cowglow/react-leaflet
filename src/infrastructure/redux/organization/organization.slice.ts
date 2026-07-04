import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Organization } from "domain/organization/organization.types.ts";

export type OrganizationSliceState = {
  items: Organization[];
};

const initialState: OrganizationSliceState = {
  items: [],
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    addOrganization(state, action: PayloadAction<Organization>) {
      return { ...state, items: [...state.items, action.payload] };
    },
    updateOrganization(state, action: PayloadAction<Organization>) {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        ),
      };
    },
    removeOrganization(state, action: PayloadAction<string>) {
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    },
  },
});

export const { addOrganization, updateOrganization, removeOrganization } =
  organizationSlice.actions;

export default organizationSlice.reducer;
