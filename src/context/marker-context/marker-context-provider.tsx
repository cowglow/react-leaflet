import { ReactNode } from "react";
import { MarkerContext } from "./markers-context.tsx";
import { LatLng } from "leaflet";
import { useLocalStorage } from "hooks/use-local-storage.ts";

interface MarkerContextProviderProps {
  children: ReactNode;
}

export const MarkerContextProvider = ({
                                        children
                                      }: MarkerContextProviderProps) => {
  const [markers, setMarkers] = useLocalStorage<LatLng[]>({
    key: "MAP_MARKERS",
    defaultValue: []
  });

  const addMarker = (latlng: LatLng) => {
    setMarkers((prevState: LatLng[]) => [
      ...prevState,
      new LatLng(latlng.lat, latlng.lng)
    ]);
  };

  const clearMarkers = () => {
    setMarkers([]);
  };

  const removeMarker = (position: LatLng) => {
    setMarkers((prevState: LatLng[]) => {
      return [...prevState.filter((_, i) => i !== prevState.indexOf(position))];
    });
  };

  return (
    <MarkerContext.Provider
      value={{
        markers,
        addMarker,
        clearMarkers,
        removeMarker
      }}
    >
      {children}
    </MarkerContext.Provider>
  );
};
