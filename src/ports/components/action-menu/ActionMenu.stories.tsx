import type { Meta, StoryObj } from "@storybook/react";
import ActionMenu from "ports/components/action-menu/ActionMenu.tsx";
import LayerControl from "ports/components/controls/LayerControl.tsx";

const meta: Meta<typeof ActionMenu> = {
  title: "ports/action-menu/ActionMenu",
  component: ActionMenu,
  parameters: { map: true },
  // Matches its real position from MapControls.tsx (topLeft, always open).
  decorators: [
    (Story) => (
      <LayerControl position="topLeft" noIcon={true}>
        <Story />
      </LayerControl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActionMenu>;

export const AsLeader: Story = {
  parameters: {
    reduxState: {
      auth: {
        status: "authenticated",
        account: { id: "account-1", email: "leader@example.com", role: "leader" },
        error: null,
      },
    },
  },
};

export const AsMember: Story = {
  parameters: {
    reduxState: {
      auth: {
        status: "authenticated",
        account: { id: "account-2", email: "member@example.com", role: "member" },
        error: null,
      },
    },
  },
};
