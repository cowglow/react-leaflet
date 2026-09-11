import { useContext } from "react";
import { TileServerContext } from "ports/context/tile-server/tile-server.context.ts";

export const useTileServer = () => useContext(TileServerContext);