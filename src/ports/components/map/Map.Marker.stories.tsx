import type { Meta, StoryObj } from "@storybook/react";
import L from "leaflet";
import { fn } from "@storybook/test";
import MapMarker from "ports/components/map/Map.Marker.tsx";

const meta: Meta<typeof MapMarker> = {
  title: "ports/map/Map.Marker",
  component: MapMarker,
  parameters: { map: true },
  args: {
    position: new L.LatLng(49.4521, 11.0767),
    remove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MapMarker>;

// The low-level primitive Marker.Point/Marker.Member build on top of — a plain
// react-leaflet Marker with a click-to-remove handler wired in by default.
export const Default: Story = {};
