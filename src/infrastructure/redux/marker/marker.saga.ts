import { put, select, takeLatest } from "redux-saga/effects";
import {
  addMarker,
  addMarkerError,
  addMarkerSuccess,
  openFile,
  openFileDone,
  openFileError,
  saveFile,
} from "infrastructure/redux/marker/marker.slice.ts";
import { loadCSVFile, exportCSVFile } from "infrastructure/csv/csv.file.ts";
import { PayloadAction } from "@reduxjs/toolkit";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

function* openFileSaga() {
  try {
    const fileContent: string = yield loadCSVFile();
    const data: string[][] = JSON.parse(fileContent);
    const items: GeoCoordinate[] = data.map(([lat, lng]) => ({
      lat: Number(lat),
      lng: Number(lng),
    }));
    yield put(openFileDone({ items }));
  } catch (error) {
    yield put(openFileError(error));
  }
}

function* saveFileSaga() {
  try {
    const markers: GeoCoordinate[] = yield select((state) => state.markers.items);
    yield exportCSVFile(markers);
    yield put(openFileDone({ items: markers }));
  } catch (error) {
    yield put(openFileError(error));
  }
}

function* addMarkerSaga(action: PayloadAction<GeoCoordinate>) {
  try {
    yield put(addMarkerSuccess(action.payload));
  } catch (error) {
    yield put(addMarkerError(error));
  }
}

export function* watchMarkerSaga() {
  yield takeLatest(openFile, openFileSaga);
  yield takeLatest(saveFile, saveFileSaga);
  yield takeLatest(addMarker, addMarkerSaga);
}