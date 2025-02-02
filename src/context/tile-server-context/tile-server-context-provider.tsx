import { ReactNode, useState } from "react";
import { TileServerContext } from "./tile-server-context.ts";
// import { useLocalStorage } from "hooks/use-local-storage.ts";
import { baseMaps } from "components/base-map-layers/lib/base-maps.ts";

interface TileServerContextProviderProps {
  children: ReactNode;
}

export const TileServerContextProvider = ({
  children,
}: TileServerContextProviderProps) => {
  const layers = Object.keys(baseMaps);
  const [selectedBaseMap, setSelectedBaseMap] = useState(layers[0]);

  // const [serverIndex, setServerIndex] = useLocalStorage({
  //   key: "TILE_SERVER",
  //   defaultValue: 0,
  // });

  // const setServer = (index: number) => {
  //   setServerIndex(index);
  // };

  const switchServer = () => {
    //   setServerIndex(Math.floor(Math.random() * tileServers.length));
  };

  return (
    <TileServerContext.Provider
      value={{
        baseMaps,
        selectedBaseMap,
        setSelectedBaseMap,
        switchServer,
      }}
    >
      {children}
    </TileServerContext.Provider>
  );
};
