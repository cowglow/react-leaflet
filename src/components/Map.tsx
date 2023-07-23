import type { ReactNode } from "react";
import type { LatLng } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

const StyledMapContainer = styled(MapContainer)`
  border: thin solid red;
  display: block;
  width: 100%;
  height: 100%;
`;

interface MapProps {
  children?: ReactNode;
  position: LatLng;
  scrollWheelZoom: boolean;
  zoom: number | undefined;
}

export default function Map({
  children,
  position,
  scrollWheelZoom,
  zoom,
}: MapProps) {
  return (
    <StyledMapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={scrollWheelZoom}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/*
      <LayersControl position="bottomleft">
        <LayersControl.Overlay name="Marker with popup">
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
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
