import { ReactNode, useEffect, useState } from "react";
import { TileServerContext } from "ports/context/tile-server/tile-server.context.ts";
import { useLocalStorage } from "ports/hooks/use-local-storage.ts";
import { baseMaps, defaultBaseMapName } from "infrastructure/tile-server/base-maps.ts";
import { TileServerName } from "ports/context/tile-server/tile-server.types.ts";

interface TileServerContextProviderProps {
  children: ReactNode;
}

export const TileServerContextProvider = ({ children }: TileServerContextProviderProps) => {
  const [storedName, setStoredName] = useLocalStorage<TileServerName>({
    key: "TILE_SERVER",
    defaultValue: defaultBaseMapName,
  });

  // A name persisted by an older build may no longer exist — fall back rather
  // than hand the map an undefined source.
  const initialName = storedName in baseMaps ? storedName : defaultBaseMapName;
  const [selectedBaseMap, setSelectedBaseMap] = useState<TileServerName>(initialName);

  useEffect(() => {
    setStoredName(selectedBaseMap);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBaseMap]);

  return (
    <TileServerContext.Provider value={{ baseMaps, selectedBaseMap, setSelectedBaseMap }}>
      {children}
    </TileServerContext.Provider>
  );
};
