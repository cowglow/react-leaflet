import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import NavigatorControl from "ports/components/controls/NavigatorControl.tsx";
import LayerControl from "ports/components/controls/LayerControl.tsx";

const meta: Meta<typeof NavigatorControl> = {
  title: "ports/controls/NavigatorControl",
  component: NavigatorControl,
  parameters: { map: true },
  // NavigatorControl is currently commented out in MapControls.tsx, so there's no
  // "real" position to match — shown here in the bottomLeft slot it's commented out
  // next to, for a plausible preview of how it'd sit once re-enabled.
  decorators: [
    (Story) => (
      <LayerControl position="bottomLeft" noIcon={true}>
        <Story />
      </LayerControl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavigatorControl>;

export const Off: Story = {};

// Toggling on calls the real navigator.geolocation.watchPosition — safe to trigger
// automatically, it just prompts for permission or fails silently in the console.
export const On: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
  },
};
