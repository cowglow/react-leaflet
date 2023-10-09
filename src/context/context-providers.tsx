import { ReactNode } from "react";
import { MarkersContextProvider } from "context/markers-context/markers-context-provider.tsx";
import { TileServerContextProvider } from "context/tile-server-context/tile-server-context-provider.tsx";
import {
  AircraftTrackPointsContextProvider
} from "context/aircraft-track-points-context/aircraft-track-points-context-provider.tsx";

interface ContextProvidersProps {
  children: ReactNode;
}

export const ContextProviders = ({ children }: ContextProvidersProps) => (
  <AircraftTrackPointsContextProvider>
    <MarkersContextProvider>
      <TileServerContextProvider>
        <>{children}</>
      </TileServerContextProvider>
    </MarkersContextProvider>
  </AircraftTrackPointsContextProvider>
);
