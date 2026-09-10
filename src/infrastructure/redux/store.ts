import createSagaMiddleware from "redux-saga";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "infrastructure/redux/auth/auth.slice.ts";
import memberSlice from "infrastructure/redux/member/member.slice.ts";
import organizationSlice from "infrastructure/redux/organization/organization.slice.ts";
import windowsSlice from "infrastructure/redux/windows/windows.slice.ts";
import { watchSaga } from "infrastructure/redux/sagas.ts";

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  auth: authSlice,
  member: memberSlice,
  organization: organizationSlice,
  windows: windowsSlice,
});

export function setupStore(preloadedState: Partial<RootState>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
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