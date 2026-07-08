import type { Meta, StoryObj } from "@storybook/react";
import { LayerControlWrapper } from "ports/components/controls/LayerControlWrapper.tsx";

const meta: Meta<typeof LayerControlWrapper> = {
  title: "ports/controls/LayerControlWrapper",
  component: LayerControlWrapper,
  parameters: { map: true },
  argTypes: {
    position: {
      control: "select",
      options: ["topLeft", "topRight", "bottomRight", "bottomLeft"],
    },
  },
  args: {
    position: "topRight",
    padding: 1,
    children: <div style={{ padding: "0.5rem" }}>Positioned content</div>,
  },
};

export default meta;
type Story = StoryObj<typeof LayerControlWrapper>;

// The raw corner-positioning primitive LayerControl builds on. Switch the "position"
// control to see it snap to each of the four map corners.
export const Default: Story = {};
