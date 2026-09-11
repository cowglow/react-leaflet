import { all, fork } from "redux-saga/effects";
import { authSaga } from "infrastructure/redux/auth/auth.saga.ts";
import { memberSaga } from "infrastructure/redux/member/member.saga.ts";
import { organizationSaga } from "infrastructure/redux/organization/organization.saga.ts";

export function* watchSaga() {
  yield all([fork(authSaga), fork(memberSaga), fork(organizationSaga)]);
}
