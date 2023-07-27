/// <reference types="vite/client" />
/// <reference types="@types/react" />

declare namespace React {
    import {ReactNode} from "react";
    export {ReactNode}
}

declare namespace L {
    import {LeafletEventHandlerFnMap, MarkerOptions} from "leaflet";
    import {EventedProps} from "@react-leaflet/core";
    export {LeafletEventHandlerFnMap, MarkerOptions, EventedProps}
}