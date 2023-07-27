import MapMarker from "../feature/map/Map.Marker.tsx";

interface MarkerProps extends MapMarkerProps {
}

export default function Marker({ children, events, position, remove, icon, alt}: MarkerProps) {
    return (
        <MapMarker
            children={children}
            events={events}
            position={position}
            remove={remove}
            icon={icon}
            alt={alt}
        />
    )
}