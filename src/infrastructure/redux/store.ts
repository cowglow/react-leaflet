import createSagaMiddleware from "redux-saga";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import markerSlice from "infrastructure/redux/marker/marker.slice.ts";
import gyroscopeSlice from "infrastructure/redux/gyroscope/gyroscope.slice.ts";
import { watchSaga } from "infrastructure/redux/sagas.ts";

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  markers: markerSlice,
  gyroscope: gyroscopeSlice,
});

export function setupStore(preloadedState: Partial<RootState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: false,
      }).concat(sagaMiddleware),
    devTools: true,
  });
  sagaMiddleware.run(watchSaga);
  return store;
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];