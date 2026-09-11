import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { apiFetch } from "infrastructure/api/api-client.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import type { Member } from "domain/member/member.types.ts";
import {
  addMemberRequested,
  addMemberSucceeded,
  fetchMembersFailed,
  fetchMembersRequested,
  fetchMembersSucceeded,
  importMembersCompleted,
  importMembersRequested,
  memberMutationFailed,
  removeMemberRequested,
  removeMemberSucceeded,
  updateMemberRequested,
  updateMemberSucceeded,
} from "infrastructure/redux/member/member.slice.ts";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function fetchMembersApi(): Promise<{ members: Member[] }> {
  return apiFetch("/members");
}

function createMemberApi(member: Member): Promise<{ member: Member }> {
  return apiFetch("/members", { method: "POST", body: JSON.stringify(member) });
}

function updateMemberApi(member: Member): Promise<{ member: Member }> {
  return apiFetch(`/members/${member.id}`, { method: "PUT", body: JSON.stringify(member) });
}

function deleteMemberApi(id: string): Promise<void> {
  return apiFetch(`/members/${id}`, { method: "DELETE" });
}

function* fetchMembersSaga() {
  try {
    const { members }: { members: Member[] } = yield call(fetchMembersApi);
    yield put(fetchMembersSucceeded(members));
  } catch (error) {
    yield put(fetchMembersFailed(errorMessage(error, "Failed to load members")));
  }
}

function* addMemberSaga(action: ReturnType<typeof addMemberRequested>) {
  const { requestId, member } = action.payload;
  try {
    const { member: created }: { member: Member } = yield call(createMemberApi, member);
    yield put(addMemberSucceeded({ requestId, member: created }));
  } catch (error) {
    yield put(memberMutationFailed({ requestId, error: errorMessage(error, "Failed to save member") }));
  }
}

function* updateMemberSaga(action: ReturnType<typeof updateMemberRequested>) {
  const { requestId, member } = action.payload;
  try {
    const { member: updated }: { member: Member } = yield call(updateMemberApi, member);
    yield put(updateMemberSucceeded({ requestId, member: updated }));
  } catch (error) {
    yield put(memberMutationFailed({ requestId, error: errorMessage(error, "Failed to save member") }));
  }
}

function* removeMemberSaga(action: ReturnType<typeof removeMemberRequested>) {
  const { requestId, id } = action.payload;
  try {
    yield call(deleteMemberApi, id);
    yield put(removeMemberSucceeded({ requestId, id }));
  } catch (error) {
    yield put(memberMutationFailed({ requestId, error: errorMessage(error, "Failed to remove member") }));
  }
}

// Best-effort delete used only by importMembersSaga's wholesale replace below — a
// row that fails to delete just lingers server-side until the next import; local
// state is about to be replaced wholesale regardless (see below).
function* deleteForImport(id: string) {
  try {
    yield call(deleteMemberApi, id);
  } catch {
    // ignored — see comment above
  }
}

function* createForImport(member: Member): Generator<unknown, Member | null, unknown> {
  try {
    const { member: created } = (yield call(createMemberApi, member)) as { member: Member };
    return created;
  } catch {
    return null;
  }
}

// Import replaces the directory wholesale: clear what's there, then persist the
// imported set. Both steps go through the real API so the result survives a
// reload, same as every other member write. Local `items` is set to exactly the
// rows that were successfully created, matching the "replace" framing even if a
// handful of individual creates failed.
function* importMembersSaga(action: ReturnType<typeof importMembersRequested>) {
  const { members: imported } = action.payload;
  const existing: Member[] = yield select(getMembers);

  yield all(existing.map((member) => call(deleteForImport, member.id)));
  const created: (Member | null)[] = yield all(imported.map((member) => call(createForImport, member)));
  const succeeded = created.filter((member): member is Member => member !== null);

  yield put(fetchMembersSucceeded(succeeded));
  yield put(
    importMembersCompleted({
      success: succeeded.length,
      total: imported.length,
      failed: imported.length - succeeded.length,
    }),
  );
}

export function* memberSaga() {
  yield all([
    takeEvery(fetchMembersRequested, fetchMembersSaga),
    takeEvery(addMemberRequested, addMemberSaga),
    takeEvery(updateMemberRequested, updateMemberSaga),
    takeEvery(removeMemberRequested, removeMemberSaga),
    takeEvery(importMembersRequested, importMembersSaga),
  ]);
}
