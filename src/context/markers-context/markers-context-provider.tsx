import { ReactNode, useState } from "react";
import { MarkersContext } from "./markers-context.tsx";
import { useLocalStorage } from "hooks/use-local-storage.ts";

interface MarkerContextProviderProps {
  children: ReactNode;
}

export const MarkersContextProvider = ({
  children,
}: MarkerContextProviderProps) => {
  const [enable, setEnable] = useState(false);
  const [markers, setMarkers] = useLocalStorage<L.LatLng[]>({
    key: "MAP_MARKERS",
    defaultValue: [],
  });

  const addMarker = ({ lat, lng }: L.LatLng) => {
    setMarkers((prevState: L.LatLng[]) => [
      ...prevState,
      new L.LatLng(lat, lng),
    ]);
  };

  const clearMarkers = () => {
    setMarkers([]);
  };

  const removeMarker = (position: L.LatLng) => {
    setMarkers((prevState: L.LatLng[]) => {
      return [...prevState.filter((_, i) => i !== prevState.indexOf(position))];
    });
  };

  return (
    <MarkersContext.Provider
      value={{
        enable,
        setEnable,
        markers,
        addMarker,
        clearMarkers,
        removeMarker,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};
