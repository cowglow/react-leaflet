import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { AppStore, setupStore } from "redux-store/store.ts";
import { AppDialogContextProvider } from "./app-dialog-context/app-dialog-context-provider.tsx";
import { TileServerContextProvider } from "context/tile-server-context/tile-server-context-provider.tsx";

const reduxStore: AppStore = setupStore({});

export const ContextProviders = ({ children }: PropsWithChildren) => (
  <Provider store={reduxStore}>
    <AppDialogContextProvider>
      <TileServerContextProvider>
        <>{children}</>
      </TileServerContextProvider>
    </AppDialogContextProvider>
  </Provider>
);
