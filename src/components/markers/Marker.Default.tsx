import MapMarker from "feature/map/Map.Marker.tsx";
import { PropsWithChildren } from "react";
import { useDispatch } from "../../redux-store/hooks.ts";
import { removeMarker } from "../../redux-store/store/marker/marker-slice.ts";
import L from "leaflet";

interface MarkerProps extends PropsWithChildren {
  position: L.LatLng;
  draggable?: boolean;
  alt?: string;
}

export default function MarkerDefault({
  children,
  position,
  draggable = false,
  alt = "",
}: MarkerProps) {
  const dispatch = useDispatch();
  return (
    <MapMarker
      children={children}
      position={position}
      draggable={draggable}
      alt={alt}
      remove={(position) => dispatch(removeMarker(position))}
    />
  );
}
