import type { Meta, StoryObj } from "@storybook/react";
import StraightenIcon from "@mui/icons-material/Straighten";
import LayerControl from "ports/components/controls/LayerControl.tsx";

const meta: Meta<typeof LayerControl> = {
  title: "ports/controls/LayerControl",
  component: LayerControl,
  parameters: { map: true },
  args: {
    position: "topLeft",
    children: <div style={{ padding: "0.5rem" }}>Panel content</div>,
  },
};

export default meta;
type Story = StoryObj<typeof LayerControl>;

export const CollapsedWithDefaultIcon: Story = {};

export const CollapsedWithCustomIcon: Story = {
  args: { icon: <StraightenIcon /> },
};

export const AlwaysOpen: Story = {
  args: { noIcon: true },
};
