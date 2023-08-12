import MapMarker from "feature/map/Map.Marker.tsx";
import type { MapMarkerProps } from "feature/map/typing.ts";

interface MarkerProps extends MapMarkerProps {
}

export default function MarkerDefault({ children, events, position, remove, alt = '' }: MarkerProps) {
	return (
		<MapMarker
			children={children}
			events={events}
			position={position}
			remove={remove}
			alt={alt}
		/>
	);


};