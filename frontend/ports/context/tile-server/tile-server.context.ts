import { createContext } from "react";
import { TileServerContextApi } from "ports/context/tile-server/tile-server.types.ts";

const defaultValues: TileServerContextApi = {
  baseMaps: {},
  selectedBaseMap: "",
  setSelectedBaseMap: () => {
    throw Error("Error:: Set Server | Uninitialized");
  },
};

export const TileServerContext = createContext<TileServerContextApi>(defaultValues);