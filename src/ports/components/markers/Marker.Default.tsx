import MapMarker from "ports/components/map/Map.Marker.tsx";
import { PropsWithChildren } from "react";
import { useDispatch } from "infrastructure/redux/hooks.ts";
import { removeMarker } from "infrastructure/redux/marker/marker.slice.ts";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";
import L from "leaflet";

interface MarkerProps extends PropsWithChildren {
  position: GeoCoordinate;
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
  const latLng = new L.LatLng(position.lat, position.lng);
  return (
    <MapMarker
      position={latLng}
      draggable={draggable}
      alt={alt}
      remove={() => dispatch(removeMarker(position))}
    >
      {children}
    </MapMarker>
  );
}
