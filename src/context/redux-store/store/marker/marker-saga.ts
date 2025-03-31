import { put, select, takeLatest } from "redux-saga/effects";
import {
  openFile,
  openFileDone,
  openFileError,
  saveFile,
} from "context/redux-store/store/marker/marker-slice.ts";
import { exportCSVFile, loadCSVFile } from "feature/csv";

function* openFileSaga() {
  try {
    const fileContent: string = yield loadCSVFile();
    const data: string[][] = JSON.parse(fileContent);
    const items = data.map(([lat, lng]) =>
      L.latLng([Number(lat), Number(lng)]),
    );
    // Simulate an async operation
    yield put(openFileDone({ items }));
  } catch (error) {
    yield put(openFileError(error));
  }
}

function* saveFileSaga() {
  try {
    const markers = yield select((state) => state.markers.items);
    const csvData: CSVData[] = markers.map(({ lat, lng }) => ({ lat, lng }));
    yield exportCSVFile(csvData);
    yield put(openFileDone({ items: markers }));
  } catch (error) {
    yield put(openFileError(error));
  }
}

export function* watchMarkerSaga() {
  yield takeLatest(openFile, openFileSaga);
  yield takeLatest(saveFile, saveFileSaga);
}
