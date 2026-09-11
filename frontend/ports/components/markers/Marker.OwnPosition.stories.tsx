import type { Meta, StoryObj } from "@storybook/react";
import MarkerOwnPosition from "ports/components/markers/Marker.OwnPosition.tsx";

const meta: Meta<typeof MarkerOwnPosition> = {
  title: "ports/markers/Marker.OwnPosition",
  component: MarkerOwnPosition,
  parameters: { map: true },
};

export default meta;
type Story = StoryObj<typeof MarkerOwnPosition>;

// Falls back to a fixed Nuremberg position if geolocation is denied/unavailable,
// which is the expected outcome in most browsers viewing Storybook.
export const Default: Story = {};
