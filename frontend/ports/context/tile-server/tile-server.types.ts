import { Dispatch, SetStateAction } from "react";
import type { BaseMapSource } from "infrastructure/tile-server/base-maps.ts";

export type TileServerName = string;

interface TileServerContextProps {
  baseMaps: Record<TileServerName, BaseMapSource>;
  selectedBaseMap: TileServerName;
}

export type TileServerContextApi = {
  setSelectedBaseMap: Dispatch<SetStateAction<TileServerName>>;
} & TileServerContextProps;
