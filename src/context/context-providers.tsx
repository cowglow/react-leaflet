import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "context/state/store.ts";
import { AircraftTrackPointsContextProvider } from "context/aircraft-track-points-context/aircraft-track-points-context-provider.tsx";
import { MarkersContextProvider } from "context/markers-context/markers-context-provider.tsx";
import { TileServerContextProvider } from "context/tile-server-context/tile-server-context-provider.tsx";

export const ContextProviders = ({ children }: PropsWithChildren) => (
  <Provider store={store}>
    <AircraftTrackPointsContextProvider>
      <MarkersContextProvider>
        <TileServerContextProvider>
          <>{children}</>
        </TileServerContextProvider>
      </MarkersContextProvider>
    </AircraftTrackPointsContextProvider>
  </Provider>
);
