import { createContext } from "react";
import { TileServerContextApi } from "context/tile-server-context/tile-server-context.type.ts";

const defaultValues: TileServerContextApi = {
  baseMaps: {},
  selectedBaseMap: "",
  setSelectedBaseMap: () => {
    throw Error("Error:: Set Server | Uninitialized");
  },
};

export const TileServerContext =
  createContext<TileServerContextApi>(defaultValues);
