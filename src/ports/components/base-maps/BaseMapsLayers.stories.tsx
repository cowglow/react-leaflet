import type { Meta, StoryObj } from "@storybook/react";
import BaseMapsLayers from "ports/components/base-maps/BaseMapsLayers.tsx";
import LayerControl from "ports/components/controls/LayerControl.tsx";

const meta: Meta<typeof BaseMapsLayers> = {
  title: "ports/base-maps/BaseMapsLayers",
  component: BaseMapsLayers,
  parameters: { map: true },
  // Matches its real position from MapControls.tsx (topRight, default layers icon).
  decorators: [
    (Story) => (
      <LayerControl position="topRight">
        <Story />
      </LayerControl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BaseMapsLayers>;

export const Default: Story = {};
