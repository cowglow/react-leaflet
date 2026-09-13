import createSagaMiddleware from "redux-saga";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "infrastructure/redux/auth/auth.slice.ts";
import memberSlice from "infrastructure/redux/member/member.slice.ts";
import organizationSlice from "infrastructure/redux/organization/organization.slice.ts";
import selectionSlice from "infrastructure/redux/selection/selection.slice.ts";
import windowsSlice from "infrastructure/redux/windows/windows.slice.ts";
import { saveWindowsState } from "infrastructure/redux/windows/windows-storage.ts";
import { watchSaga } from "infrastructure/redux/sagas.ts";

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
  auth: authSlice,
  member: memberSlice,
  organization: organizationSlice,
  selection: selectionSlice,
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

  // Persist just the windows slice - which dialogs are open, with what
  // payload, and their stacking order - so a reload restores the UI instead
  // of dropping back to a bare desktop; data itself always comes fresh from
  // the API regardless. Reference-equality check skips the (many) unrelated
  // actions that don't touch this slice at all.
  let previousWindows = store.getState().windows;
  store.subscribe(() => {
    const nextWindows = store.getState().windows;
    if (nextWindows !== previousWindows) {
      previousWindows = nextWindows;
      saveWindowsState(nextWindows);
    }
  });

  return store;
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];