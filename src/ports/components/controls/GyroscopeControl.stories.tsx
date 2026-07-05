import type { Meta, StoryObj } from "@storybook/react";
import GyroscopeControl from "ports/components/controls/GyroscopeControl.tsx";
import LayerControl from "ports/components/controls/LayerControl.tsx";

const meta: Meta<typeof GyroscopeControl> = {
  title: "ports/controls/GyroscopeControl",
  component: GyroscopeControl,
  parameters: { map: true },
  // Also currently commented out in MapControls.tsx — shown in the bottomLeft slot
  // it's commented out next to, matching NavigatorControl's story treatment.
  decorators: [
    (Story) => (
      <LayerControl position="bottomLeft" noIcon={true}>
        <Story />
      </LayerControl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GyroscopeControl>;

// The ON/OFF button is only enabled when the browser supports DeviceOrientationEvent —
// most desktop browsers don't, so it may render disabled regardless of story here.
export const Off: Story = {
  parameters: { reduxState: { gyroscope: { enabled: false, alpha: 0 } } },
};

export const On: Story = {
  parameters: { reduxState: { gyroscope: { enabled: true, alpha: 45 } } },
};
