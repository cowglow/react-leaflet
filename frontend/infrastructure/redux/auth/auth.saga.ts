import { all, call, put, takeEvery } from "redux-saga/effects";
import { apiFetch, NetworkError } from "infrastructure/api/api-client.ts";
import { getStoredToken, setStoredToken } from "infrastructure/api/token-storage.ts";
import {
  Account,
  fetchAccountsFailed,
  fetchAccountsRequested,
  fetchAccountsSucceeded,
  inviteAccountFailed,
  inviteAccountRequested,
  inviteAccountSucceeded,
  requestMagicLinkFailed,
  requestMagicLinkRequested,
  requestMagicLinkSucceeded,
  restoreSessionFailed,
  restoreSessionRequested,
  restoreSessionSucceeded,
  updateAccountFailed,
  updateAccountRequested,
  updateAccountSucceeded,
  verifyMagicLinkFailed,
  verifyMagicLinkRequested,
  verifyMagicLinkSucceeded,
} from "infrastructure/redux/auth/auth.slice.ts";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function fetchAccountApi(): Promise<{ account: Account }> {
  return apiFetch("/auth/me");
}

function requestMagicLinkApi(email: string): Promise<{ message: string; devToken?: string }> {
  return apiFetch("/auth/magic-link", { method: "POST", body: JSON.stringify({ email }) });
}

function verifyMagicLinkApi(token: string): Promise<{ token: string; account: Account }> {
  return apiFetch("/auth/verify", { method: "POST", body: JSON.stringify({ token }) });
}

function inviteAccountApi(input: {
  email: string;
  role: string;
  memberId?: string;
}): Promise<{ account: Account }> {
  return apiFetch("/auth/invite", { method: "POST", body: JSON.stringify(input) });
}

function fetchAccountsApi(): Promise<{ accounts: Account[] }> {
  return apiFetch("/auth/accounts");
}

function updateAccountApi(
  accountId: string,
  input: { role: string; memberId?: string | null },
): Promise<{ account: Account }> {
  return apiFetch(`/auth/accounts/${accountId}`, { method: "PATCH", body: JSON.stringify(input) });
}

function* restoreSessionSaga() {
  const token = getStoredToken();
  if (!token) {
    yield put(restoreSessionSucceeded(null));
    return;
  }
  try {
    const { account }: { account: Account } = yield call(fetchAccountApi);
    yield put(restoreSessionSucceeded(account));
  } catch (error) {
    yield put(restoreSessionFailed({ network: error instanceof NetworkError }));
  }
}

// Shared by the real magic-link-in-URL flow (verifyMagicLinkSaga, below) and
// requestMagicLinkSaga's dev-only shortcut — both just need "verify this token,
// then reflect success/failure on auth state," nothing route-specific.
function* performVerify(token: string) {
  try {
    const response: { token: string; account: Account } = yield call(verifyMagicLinkApi, token);
    setStoredToken(response.token);
    yield put(verifyMagicLinkSucceeded(response.account));
  } catch (error) {
    yield put(verifyMagicLinkFailed(errorMessage(error, "Invalid or expired login link")));
  }
}

function* verifyMagicLinkSaga(action: ReturnType<typeof verifyMagicLinkRequested>) {
  yield call(performVerify, action.payload.token);
}

function* requestMagicLinkSaga(action: ReturnType<typeof requestMagicLinkRequested>) {
  try {
    const response: { message: string; devToken?: string } = yield call(
      requestMagicLinkApi,
      action.payload.email,
    );
    if (response.devToken) {
      // No real email provider outside production — skip straight to signed-in
      // instead of making the developer go find the token in the server console.
      yield call(performVerify, response.devToken);
    } else {
      yield put(requestMagicLinkSucceeded());
    }
  } catch (error) {
    yield put(requestMagicLinkFailed(errorMessage(error, "Failed to request a login link")));
  }
}

function* inviteAccountSaga(action: ReturnType<typeof inviteAccountRequested>) {
  const { requestId, email, role, memberId } = action.payload;
  try {
    yield call(inviteAccountApi, { email, role, memberId });
    yield put(inviteAccountSucceeded({ requestId }));
  } catch (error) {
    yield put(inviteAccountFailed({ requestId, error: errorMessage(error, "Failed to send invite") }));
  }
}

function* fetchAccountsSaga() {
  try {
    const { accounts }: { accounts: Account[] } = yield call(fetchAccountsApi);
    yield put(fetchAccountsSucceeded(accounts));
  } catch (error) {
    yield put(fetchAccountsFailed(errorMessage(error, "Failed to load accounts")));
  }
}

function* updateAccountSaga(action: ReturnType<typeof updateAccountRequested>) {
  const { requestId, accountId, role, memberId } = action.payload;
  try {
    const { account }: { account: Account } = yield call(updateAccountApi, accountId, { role, memberId });
    yield put(updateAccountSucceeded({ requestId, account }));
  } catch (error) {
    yield put(updateAccountFailed({ requestId, error: errorMessage(error, "Failed to update account") }));
  }
}

export function* authSaga() {
  yield all([
    takeEvery(restoreSessionRequested, restoreSessionSaga),
    takeEvery(requestMagicLinkRequested, requestMagicLinkSaga),
    takeEvery(verifyMagicLinkRequested, verifyMagicLinkSaga),
    takeEvery(inviteAccountRequested, inviteAccountSaga),
    takeEvery(fetchAccountsRequested, fetchAccountsSaga),
    takeEvery(updateAccountRequested, updateAccountSaga),
  ]);
}
