import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import MapEvents from "ports/components/map/Map.Events.tsx";

const meta: Meta<typeof MapEvents> = {
  title: "ports/map/Map.Events",
  component: MapEvents,
  parameters: { map: true },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MapEvents>;

// Renders nothing — the canvas is just an empty map. Click anywhere on it and check
// the Actions panel below to see onClick fire with the Leaflet mouse event.
export const Default: Story = {};
