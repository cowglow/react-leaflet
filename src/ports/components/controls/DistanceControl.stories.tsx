import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import StraightenIcon from "@mui/icons-material/Straighten";
import DistanceControl from "ports/components/controls/DistanceControl.tsx";
import LayerControl from "ports/components/controls/LayerControl.tsx";
import { sampleMembers } from "ports/testing/story-fixtures.ts";

const withMembersState = {
  member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
};

const meta: Meta<typeof DistanceControl> = {
  title: "ports/controls/DistanceControl",
  component: DistanceControl,
  parameters: { map: true },
  // Matches its real position/icon from MapControls.tsx (topRight, StraightenIcon)
  // instead of rendering unpositioned, which looked wrong compared to production.
  decorators: [
    (Story) => (
      <LayerControl position="topRight" icon={<StraightenIcon />}>
        <Story />
      </LayerControl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DistanceControl>;

export const Empty: Story = {
  parameters: { reduxState: { member: { items: [], filteredLimit: 0, loading: false, error: null } } },
};

export const WithMembers: Story = {
  parameters: { reduxState: withMembersState },
};

export const OriginSelected: Story = {
  parameters: { reduxState: withMembersState },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByLabelText("Distance from"), sampleMembers[0].id);
  },
};
