import { Dispatch, SetStateAction } from "react";

interface TileServerContextProps {
  baseMaps: Record<string, L.TileLayer>;
  selectedBaseMap: string;
}

export type TileServerContextApi = {
  setSelectedBaseMap: Dispatch<SetStateAction<string>>;
  switchServer: () => void;
} & TileServerContextProps;
