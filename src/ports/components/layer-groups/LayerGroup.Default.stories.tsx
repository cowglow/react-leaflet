import type { Meta, StoryObj } from "@storybook/react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import LayerGroupDefault from "ports/components/layer-groups/LayerGroup.Default.tsx";

const meta: Meta<typeof LayerGroupDefault> = {
  title: "ports/layer-groups/LayerGroup.Default",
  component: LayerGroupDefault,
  parameters: { map: true },
};

export default meta;
type Story = StoryObj<typeof LayerGroupDefault>;

export const WithMarkers: Story = {
  args: {
    children: (
      <>
        <Marker position={new L.LatLng(49.4521, 11.0767)} />
        <Marker position={new L.LatLng(49.4459, 11.0821)} />
      </>
    ),
  },
};
