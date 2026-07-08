import type { Meta, StoryObj } from "@storybook/react";
import L from "leaflet";
import AircraftMarker from "ports/components/markers/Marker.Aircraft.tsx";

const meta: Meta<typeof AircraftMarker> = {
  title: "ports/markers/Marker.Aircraft",
  component: AircraftMarker,
  parameters: { map: true },
  args: {
    position: new L.LatLng(49.4521, 11.0767),
  },
};

export default meta;
type Story = StoryObj<typeof AircraftMarker>;

export const Default: Story = {
  args: { bearing: 45 },
};

export const HeadingSouth: Story = {
  args: { bearing: 180 },
};
