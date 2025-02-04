import { ReactNode, useEffect, useState } from "react";
import { TileServerContext } from "./tile-server-context.ts";
import { useLocalStorage } from "hooks/use-local-storage.ts";
import { baseMaps } from "components/base-map-layers/lib/base-maps.ts";
import { TileServerName } from "context/tile-server-context/tile-server-context.type.ts";

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

  const [selectedBaseMap, setSelectedBaseMap] =
    useState<TileServerName>(serverIndex);

  useEffect(() => {
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
