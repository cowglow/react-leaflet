import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { AppStore, setupStore } from "infrastructure/redux/store.ts";
import { AppDialogContextProvider } from "ports/context/app-dialog/app-dialog.provider.tsx";
import { TileServerContextProvider } from "ports/context/tile-server/tile-server.provider.tsx";

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