import type { Meta, StoryObj } from "@storybook/react";
import MapAttribution from "ports/components/map/MapAttribution.tsx";

const meta: Meta<typeof MapAttribution> = {
  title: "ports/map/MapAttribution",
  component: MapAttribution,
  parameters: { map: true },
};

export default meta;
type Story = StoryObj<typeof MapAttribution>;

// Renders nothing itself, but adds the selected tile layer straight to the underlying
// Leaflet map instance — the story canvas shows real map tiles as a result.
export const Default: Story = {};
