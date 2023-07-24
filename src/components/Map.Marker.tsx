import { Marker, Popup, Tooltip } from "react-leaflet";
import type { LatLng, LeafletEventHandlerFnMap } from "leaflet";
import { MarkerOptions } from "leaflet";
import { EventedProps } from "@react-leaflet/core";
import { ReactNode } from "react";

interface MapMarkerProps extends MarkerOptions, EventedProps {
  children?: ReactNode;
  position: LatLng;
  remove: (position: LatLng) => void;
  events?: LeafletEventHandlerFnMap;
}

export default function MapMarker({
  children,
  position,
  remove,
  events,
}: MapMarkerProps) {
  let eventHandlers: LeafletEventHandlerFnMap = {
    click: () => remove(position),
  };
  if (events) {
    eventHandlers = events;
  }

  return (
    <Marker position={position} {...{ eventHandlers }}>
      <Popup>Popup Text</Popup>
      <Tooltip>Tooltip</Tooltip>
      {children}
    </Marker>
  );
}
