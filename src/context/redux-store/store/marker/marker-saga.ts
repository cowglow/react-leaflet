import { put, takeLatest } from "redux-saga/effects";
import {
  openFile,
  openFileDone,
  openFileError,
} from "context/redux-store/store/marker/marker-slice.ts";

async function* openFileSaga() {
  try {
    // const file = document.querySelector("#input-file-button")?.files?.[0];
    // const reader = new FileReader();
    // reader.onload = function (event) {
    //   const content = event.target?.result;
    //   console.log("File content:", content);
    //   // Process the file content as needed
    // };
    // reader.readAsText(file);
    console.log("Open file saga triggered with action:");
    // Simulate an async operation
    yield new Promise((resolve) => setTimeout(resolve, 1000));
    yield put(openFileDone());
  } catch (error) {
    yield put(openFileError(error));
  }
}

export function* watchMarkerSaga() {
  yield takeLatest(openFile, openFileSaga);
}
