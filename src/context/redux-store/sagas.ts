import { all, fork } from "redux-saga/effects";
import { watchMarkerSaga } from "context/redux-store/store/marker/marker-saga.ts";

export function* watchSaga() {
  yield all([fork(watchMarkerSaga)]);
}
