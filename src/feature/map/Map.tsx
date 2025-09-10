import type { MapContainerProps } from "react-leaflet";
import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import MapAttribution from "feature/map/MapAttribution.tsx";
import { Box } from "@mui/material";
import { useSelector } from "redux-store/hooks.ts";
import { getGyroscopeEnabled } from "redux-store/store/gyroscope/gyroscope-selectors.ts";

const MapWrapper = styled(Box)`
  flex: 1;
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`;
const StyledMapContainer = styled(MapContainer)`
  display: block;
  width: 100%;
  height: 100%;
`;
const GyroScopeMask = styled(Box)`
  position: absolute;
  z-index: 1000;
  width: 100%;
  height: 100%;
  mask-image: radial-gradient(circle at 50% 50%, transparent 50%, black 50%);
  background-color: wheat;
  overflow: hidden;
`;

export default function Map({
  children,
  center,
  scrollWheelZoom,
  zoom,
}: MapContainerProps) {
  const isGyroscope = useSelector(getGyroscopeEnabled);
  return (
    <MapWrapper>
      <GyroScopeMask display={isGyroscope ? "block" : "none"}>
        &nbsp;
      </GyroScopeMask>
      <StyledMapContainer
        zoomControl={false}
        center={center}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        minZoom={2}
      >
        <MapAttribution />
        {children}
      </StyledMapContainer>
    </MapWrapper>
  );
}
