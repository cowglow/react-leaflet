import { all, call, put, takeEvery } from "redux-saga/effects";
import { apiFetch } from "infrastructure/api/api-client.ts";
import type { Organization } from "domain/organization/organization.types.ts";
import { fetchMembersRequested } from "infrastructure/redux/member/member.slice.ts";
import {
  addOrganizationRequested,
  addOrganizationSucceeded,
  fetchOrganizationsFailed,
  fetchOrganizationsRequested,
  fetchOrganizationsSucceeded,
  organizationMutationFailed,
  removeOrganizationRequested,
  removeOrganizationSucceeded,
  updateOrganizationRequested,
  updateOrganizationSucceeded,
} from "infrastructure/redux/organization/organization.slice.ts";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function fetchOrganizationsApi(): Promise<{ organizations: Organization[] }> {
  return apiFetch("/organizations");
}

function createOrganizationApi(organization: Organization): Promise<{ organization: Organization }> {
  return apiFetch("/organizations", { method: "POST", body: JSON.stringify(organization) });
}

function updateOrganizationApi(organization: Organization): Promise<{ organization: Organization }> {
  return apiFetch(`/organizations/${organization.id}`, { method: "PUT", body: JSON.stringify(organization) });
}

function deleteOrganizationApi(id: string): Promise<void> {
  return apiFetch(`/organizations/${id}`, { method: "DELETE" });
}

function* fetchOrganizationsSaga() {
  try {
    const { organizations }: { organizations: Organization[] } = yield call(fetchOrganizationsApi);
    yield put(fetchOrganizationsSucceeded(organizations));
  } catch (error) {
    yield put(fetchOrganizationsFailed(errorMessage(error, "Failed to load organizations")));
  }
}

function* addOrganizationSaga(action: ReturnType<typeof addOrganizationRequested>) {
  const { requestId, organization } = action.payload;
  try {
    const { organization: created }: { organization: Organization } = yield call(
      createOrganizationApi,
      organization,
    );
    yield put(addOrganizationSucceeded({ requestId, organization: created }));
  } catch (error) {
    yield put(
      organizationMutationFailed({ requestId, error: errorMessage(error, "Failed to save organization") }),
    );
  }
}

function* updateOrganizationSaga(action: ReturnType<typeof updateOrganizationRequested>) {
  const { requestId, organization } = action.payload;
  try {
    const { organization: updated }: { organization: Organization } = yield call(
      updateOrganizationApi,
      organization,
    );
    yield put(updateOrganizationSucceeded({ requestId, organization: updated }));
  } catch (error) {
    yield put(
      organizationMutationFailed({ requestId, error: errorMessage(error, "Failed to save organization") }),
    );
  }
}

// The Member.organizationId foreign key is ON DELETE SET NULL (see the init
// migration), so deleting an org already un-assigns its members server-side -
// refetching members here just brings the client's copy of that back in sync
// (they show up as unassigned rather than vanishing or keeping a dangling id).
function* removeOrganizationSaga(action: ReturnType<typeof removeOrganizationRequested>) {
  const { requestId, id } = action.payload;
  try {
    yield call(deleteOrganizationApi, id);
    yield put(removeOrganizationSucceeded({ requestId, id }));
    yield put(fetchMembersRequested());
  } catch (error) {
    yield put(
      organizationMutationFailed({ requestId, error: errorMessage(error, "Failed to remove organization") }),
    );
  }
}

export function* organizationSaga() {
  yield all([
    takeEvery(fetchOrganizationsRequested, fetchOrganizationsSaga),
    takeEvery(addOrganizationRequested, addOrganizationSaga),
    takeEvery(updateOrganizationRequested, updateOrganizationSaga),
    takeEvery(removeOrganizationRequested, removeOrganizationSaga),
  ]);
}
