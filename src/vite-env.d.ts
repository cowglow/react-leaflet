/// <reference types="vite/client" />
/// <reference types="@types/react" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace React {
  import { ReactNode } from "react";
  export { ReactNode };
}

declare namespace L {
  import { LeafletEventHandlerFnMap, MarkerOptions } from "leaflet";
  import { EventedProps } from "@react-leaflet/core";
  export { LeafletEventHandlerFnMap, MarkerOptions, EventedProps };
}

type MarkerType = "AIRCRAFT" | "CUSTOM" | "DEFAULT"

type MarkerMode = "POINT" | "POLYGON"
