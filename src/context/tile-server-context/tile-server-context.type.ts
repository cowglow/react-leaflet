import { Dispatch, SetStateAction } from "react";

export type TileServerName = string;

interface TileServerContextProps {
  baseMaps: Record<TileServerName, L.TileLayer>;
  selectedBaseMap: TileServerName;
}

export type TileServerContextApi = {
  setSelectedBaseMap: Dispatch<SetStateAction<TileServerName>>;
} & TileServerContextProps;
