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

export const SubmenuItem: Story = {
  args: {
    config: {
      label: "Language",
      items: [
        { label: "English", action: () => alert("English selected") },
        { label: "Deutsch", action: () => alert("Deutsch selected") },
        { label: "Español", action: () => alert("Español selected") },
      ],
    },
  },
};
