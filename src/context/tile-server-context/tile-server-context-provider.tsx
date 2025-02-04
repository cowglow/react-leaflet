import { ReactNode, useEffect, useState } from "react";
import { TileServerContext } from "./tile-server-context.ts";
import { useLocalStorage } from "hooks/use-local-storage.ts";
import { baseMaps } from "components/base-map-layers/lib/base-maps.ts";

interface TileServerContextProviderProps {
  children: ReactNode;
}

export const TileServerContextProvider = ({
  children,
}: TileServerContextProviderProps) => {
  const layers = Object.keys(baseMaps);

  const [serverIndex, setServerIndex] = useLocalStorage({
    key: "TILE_SERVER",
    defaultValue: layers[0],
  });

  const initialMap = serverIndex && layers[0];
  const [selectedBaseMap, setSelectedBaseMap] = useState(initialMap);

  useEffect(() => {
    console.log(selectedBaseMap);
    setServerIndex(selectedBaseMap);
  }, [selectedBaseMap]);

  return (
    <TileServerContext.Provider
      value={{
        baseMaps,
        selectedBaseMap,
        setSelectedBaseMap,
      }}
    >
      {children}
    </TileServerContext.Provider>
  );
};
