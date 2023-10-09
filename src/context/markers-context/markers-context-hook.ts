import { useContext } from "react";
import { MarkersContext } from "./markers-context.tsx";

export const useMarkersContext = () => useContext(MarkersContext);
