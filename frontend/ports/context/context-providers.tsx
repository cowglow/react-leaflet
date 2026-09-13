import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { AppStore, setupStore } from "infrastructure/redux/store.ts";
import { loadWindowsState } from "infrastructure/redux/windows/windows-storage.ts";
import { TileServerContextProvider } from "ports/context/tile-server/tile-server.provider.tsx";
import { I18nContextProvider } from "ports/context/i18n/i18n.provider.tsx";

const persistedWindows = loadWindowsState();
const reduxStore: AppStore = setupStore(persistedWindows ? { windows: persistedWindows } : {});

export const ContextProviders = ({ children }: PropsWithChildren) => (
  <Provider store={reduxStore}>
    <I18nContextProvider>
      <TileServerContextProvider>
        <>{children}</>
      </TileServerContextProvider>
    </I18nContextProvider>
  </Provider>
);