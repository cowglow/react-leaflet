import { ReactNode } from "react";
import { MarkerContext } from "./markers-context.tsx";
import type { LeafletMouseEvent } from "leaflet";
import { LatLng } from "leaflet";
import { useLocalStorage } from "../../hooks/use-local-storage.ts";

interface MarkerContextProviderProps {
  children: ReactNode;
}

export const MarkerContextProvider = ({
  children,
}: MarkerContextProviderProps) => {
  const [markers, setMarkers] = useLocalStorage<LatLng[]>({
    key: "MAP_MARKERS",
    defaultValue: [],
  });

  const addMarker = ({ latlng }: LeafletMouseEvent) => {
    setMarkers((prevState: LatLng[]) => [
      ...prevState,
      new LatLng(latlng.lat, latlng.lng),
    ]);
  };

  return (
    <MarkerContext.Provider
      value={{
        markers,
        addMarker,
      }}
    >
      {children}
    </MarkerContext.Provider>
  );
};
