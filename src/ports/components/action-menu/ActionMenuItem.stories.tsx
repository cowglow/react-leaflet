import type { Meta, StoryObj } from "@storybook/react";
import ActionMenuItem from "ports/components/action-menu/ActionMenuItem.tsx";

const meta: Meta<typeof ActionMenuItem> = {
  title: "ports/action-menu/ActionMenuItem",
  component: ActionMenuItem,
};

export default meta;
type Story = StoryObj<typeof ActionMenuItem>;

export const ActionItem: Story = {
  args: {
    config: { label: "Add member", action: () => alert("Add member clicked") },
  },
};

export const LinkItem: Story = {
  args: {
    config: { label: "Documentation", href: "https://example.com/docs" },
  },
};

export const DividerItem: Story = {
  args: {
    config: "---",
  },
};
