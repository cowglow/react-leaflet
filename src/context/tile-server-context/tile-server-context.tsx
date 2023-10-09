import { createContext } from "react";

const defaultValues: TileServerContextApi = {
  tileServers: [],
  tileServer: {
    label: "Error:: Tile Server Label | Uninitialized",
    url: "Error:: Tile Server Url | Uninitialized"
  },
  setServer: () => {
    throw Error("Error:: Set Server | Uninitialized");
  },
  switchServer: () => {
    throw Error("Error:: Switch Server | Uninitialized");
  }
};

export const TileServerContext = createContext<TileServerContextApi>(defaultValues);
