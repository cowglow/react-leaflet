import { useContext } from "react";
import { TileServerContext } from "context/tile-server-context/tile-server-context.tsx";

export const useTileServer = () => useContext(TileServerContext);