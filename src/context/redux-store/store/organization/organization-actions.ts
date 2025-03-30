const getOrganizations = () => ({
  loading: true,
});
const getOrganizationsSuccess = (action: { payload: unknown }) => ({
  organizations: action.payload,
  loading: false,
});
const getOrganizationsError = (action) => ({
  error: action.payload,
  loading: false,
});
const getOrganization = () => ({
  loading: true,
});
const getOrganizationSuccess = (action) => ({
  organization: action.payload,
  loading: false,
});
const getOrganizationError = (action) => ({
  error: action.payload,
  loading: false,
});
