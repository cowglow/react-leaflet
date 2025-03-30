import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { AppStore, setupStore } from "context/redux-store/store.ts";
import { TileServerContextProvider } from "context/tile-server-context/tile-server-context-provider.tsx";

const reduxStore: AppStore = setupStore({});
export const ContextProviders = ({ children }: PropsWithChildren) => (
  <Provider store={reduxStore}>
    {/*<AircraftTrackPointsContextProvider>*/}
    {/*  <AppDialogContextProvider>*/}
    {/*    <MarkersContextProvider>*/}
    <TileServerContextProvider>
      <>{children}</>
    </TileServerContextProvider>
    {/*    </MarkersContextProvider>*/}
    {/*  </AppDialogContextProvider>*/}
    {/*</AircraftTrackPointsContextProvider>*/}
  </Provider>
);
