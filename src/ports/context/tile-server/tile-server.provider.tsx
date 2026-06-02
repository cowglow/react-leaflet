import { ReactNode, useEffect, useState } from "react";
import { TileServerContext } from "ports/context/tile-server/tile-server.context.ts";
import { useLocalStorage } from "ports/hooks/use-local-storage.ts";
import { baseMaps } from "infrastructure/tile-server/base-maps.ts";
import { TileServerName } from "ports/context/tile-server/tile-server.types.ts";

interface TileServerContextProviderProps {
  children: ReactNode;
}

export const TileServerContextProvider = ({ children }: TileServerContextProviderProps) => {
  const layers = Object.keys(baseMaps);

  const [serverIndex, setServerIndex] = useLocalStorage({
    key: "TILE_SERVER",
    defaultValue: layers[0],
  });

  const [selectedBaseMap, setSelectedBaseMap] = useState<TileServerName>(serverIndex);

  useEffect(() => {
    setServerIndex(selectedBaseMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBaseMap]);

  return (
    <TileServerContext.Provider value={{ baseMaps, selectedBaseMap, setSelectedBaseMap }}>
      {children}
    </TileServerContext.Provider>
  );
};