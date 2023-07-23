import { ReactNode } from "react";
import { MarkerContextProvider } from "./marker-context/marker-context-provider.tsx";

interface ContextProvidersProps {
  children: ReactNode;
}

export const ContextProviders = ({ children }: ContextProvidersProps) => (
  <MarkerContextProvider>
    <>{children}</>
  </MarkerContextProvider>
);
