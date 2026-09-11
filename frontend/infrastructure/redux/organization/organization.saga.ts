import { all, call, put, takeEvery } from "redux-saga/effects";
import { apiFetch } from "infrastructure/api/api-client.ts";
import type { Organization } from "domain/organization/organization.types.ts";
import {
  addOrganizationRequested,
  addOrganizationSucceeded,
  fetchOrganizationsFailed,
  fetchOrganizationsRequested,
  fetchOrganizationsSucceeded,
  organizationMutationFailed,
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

export function* organizationSaga() {
  yield all([
    takeEvery(fetchOrganizationsRequested, fetchOrganizationsSaga),
    takeEvery(addOrganizationRequested, addOrganizationSaga),
  ]);
}
