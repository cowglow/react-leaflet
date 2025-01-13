import type { MapContainerProps } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import MapAttribution from "feature/map/MapAttribution.tsx";

const StyledMapContainer = styled(MapContainer)`
  display: block;
  width: 100%;
  height: 100%;
`;

export default function Map({
  children,
  center,
  scrollWheelZoom,
  zoom,
}: MapContainerProps) {
  return (
    <StyledMapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      minZoom={2}
    >
      <MapAttribution />
      {children}
    </StyledMapContainer>
  );
}
