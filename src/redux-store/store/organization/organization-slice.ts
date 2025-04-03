import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  organizations: [],
  organization: {},
  loading: false,
  error: null,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    getOrganizations: (state) => {
      state.loading = true;
    },
    getOrganizationsSuccess: (state, action) => {
      state.organizations = action.payload;
      state.loading = false;
    },
    getOrganizationsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    getOrganization: (state) => {
      state.loading = true;
    },
    getOrganizationSuccess: (state, action) => {
      state.organization = action.payload;
      state.loading = false;
    },
    getOrganizationError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getOrganizations,
  getOrganizationsSuccess,
  getOrganizationsError,
  getOrganization,
  getOrganizationSuccess,
  getOrganizationError,
} = organizationSlice.actions;
