import type { Meta, StoryObj } from "@storybook/react";
import MainLayout from "ports/components/layout/MainLayout.tsx";

const meta: Meta<typeof MainLayout> = {
  title: "ports/layout/MainLayout",
  component: MainLayout,
};

export default meta;
type Story = StoryObj<typeof MainLayout>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: "1rem" }}>Page content goes here</div>,
  },
};
