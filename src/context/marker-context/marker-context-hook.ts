import { useContext } from "react";
import { MarkerContext } from "./markers-context.tsx";

export const useMarkersContext = () => useContext(MarkerContext);
