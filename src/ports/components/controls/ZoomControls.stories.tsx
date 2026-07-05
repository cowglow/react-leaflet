import type { Meta, StoryObj } from "@storybook/react";
import ZoomControls from "ports/components/controls/ZoomControls.tsx";
import LayerControl from "ports/components/controls/LayerControl.tsx";

const meta: Meta<typeof ZoomControls> = {
  title: "ports/controls/ZoomControls",
  component: ZoomControls,
  parameters: {
    map: true,
  },
  // Matches its real position from MapControls.tsx (bottomLeft, always open).
  decorators: [
    (Story) => (
      <LayerControl position="bottomLeft" noIcon={true}>
        <Story />
      </LayerControl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ZoomControls>;

export const Default: Story = {};
