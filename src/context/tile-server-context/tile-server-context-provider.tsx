import { ReactNode } from "react";
import { TileServerContext } from "./tile-server-context.tsx";
import { useLocalStorage } from "hooks/use-local-storage.ts";

interface TileServerContextProviderProps {
  children: ReactNode;
}

export const TileServerContextProvider = ({ children }: TileServerContextProviderProps) => {
  const tileServers = [
    {
      label: "Carto (Basemaps)",
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
    },
    {
      label: "Open Street Map (Default)",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    },
    {
      label: "Open Street Map (Fr)",
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    },
    {
      label: "Open Street Map (De)",
      url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png"
    },
    {
      label: "Memo Maps",
      url: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png"
    },
    {
      label: "Open Top Map",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
    },
    {
      label: "Stadia Maps",
      url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
    }
  ];

  const [serverIndex, setServerIndex] = useLocalStorage({ key: "TILE_SERVER", defaultValue: 0 });

  const setServer = (index: number) => {
    setServerIndex(index);
  };

  const switchServer = () => {
    setServerIndex(Math.floor(Math.random() * tileServers.length));
  };

  return (
    <TileServerContext.Provider
      value={{
        tileServers,
        tileServer: tileServers[serverIndex],
        setServer,
        switchServer
      }}
    >
      {children}
    </TileServerContext.Provider>
  );
};