import type { Meta, StoryObj } from "@storybook/react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import MapLayerGroup from "ports/components/map/Map.LayerGroup.tsx";

const meta: Meta<typeof MapLayerGroup> = {
  title: "ports/map/Map.LayerGroup",
  component: MapLayerGroup,
  parameters: { map: true },
};

export default meta;
type Story = StoryObj<typeof MapLayerGroup>;

// Thin react-leaflet LayerGroup passthrough — LayerGroup.Default wraps this directly
// with identical behavior, this story exists for documentation completeness.
export const WithMarkers: Story = {
  args: {
    children: <Marker position={new L.LatLng(49.4521, 11.0767)} />,
  },
};
