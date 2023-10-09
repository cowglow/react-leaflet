import type { MapContainerProps } from "react-leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import { useTileServer } from "context/tile-server-context/tile-server-context-hook.ts";

const StyledMapContainer = styled(MapContainer)`
  display: block;
  width: 100%;
  height: 100%;
`;

export default function Map({
                              children,
                              center,
                              scrollWheelZoom,
                              zoom
                            }: MapContainerProps) {
  const { tileServer } = useTileServer();
  return (
    <StyledMapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
      boundsOptions={{
        maxZoom: 2
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={tileServer.url}
      />
      {/*
      <LayersControl position="bottomleft">
        <LayersControl.Overlay name="MarkerDefault with popup">
          <MarkerDefault position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </MarkerDefault>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Layer group with circles">
          <LayerGroup>
            <Circle
              center={position}
              pathOptions={{ fillColor: "blue" }}
              radius={200}
            />
            <Circle
              center={position}
              pathOptions={{ fillColor: "red" }}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={[51.51, -0.08]}
                pathOptions={{ color: "green", fillColor: "green" }}
                radius={100}
              />
            </LayerGroup>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Feature group">
          <FeatureGroup pathOptions={{ color: "purple" }}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[51.51, -0.06]} radius={200} />
            <Rectangle bounds={rectangle as LatLngBoundsExpression} />
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>
      */}
      {children}
    </StyledMapContainer>
  );
}
