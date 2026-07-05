import type { Meta, StoryObj } from "@storybook/react";
import { Popup } from "react-leaflet";
import L from "leaflet";
import { fn } from "@storybook/test";
import MarkerPoint from "ports/components/markers/Marker.Point.tsx";

const meta: Meta<typeof MarkerPoint> = {
  title: "ports/markers/Marker.Point",
  component: MarkerPoint,
  parameters: { map: true },
  args: {
    position: new L.LatLng(49.4521, 11.0767),
    remove: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MarkerPoint>;

export const Default: Story = {};

export const WithPopup: Story = {
  args: {
    children: <Popup>A custom point marker</Popup>,
  },
};
