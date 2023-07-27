import MapMarker from "../feature/map/Map.Marker.tsx";
import { ReactNode } from "react";

interface MarkerProps extends MapMarkerProps {}

type RestProps =  Omit<MarkerProps, "position" | "children" | "events" | "remove">

export default function Marker({ children, events, position, remove, ...other }: MarkerProps) {
  return (
    <MapMarker
      children={children}
      events={events}
      position={position}
      remove={remove}
      {...other}
    />
  );


};