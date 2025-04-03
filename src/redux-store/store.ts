import createSagaMiddleware from "redux-saga";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import markerSlice from "redux-store/store/marker/marker-slice.ts";
import { watchSaga } from "redux-store/sagas.ts";

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  markers: markerSlice,
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
