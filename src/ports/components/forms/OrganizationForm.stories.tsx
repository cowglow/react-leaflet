import type { Meta, StoryObj } from "@storybook/react";
import OrganizationForm from "ports/components/forms/OrganizationForm.tsx";

const meta: Meta<typeof OrganizationForm> = {
  title: "ports/forms/OrganizationForm",
  component: OrganizationForm,
};

export default meta;
type Story = StoryObj<typeof OrganizationForm>;

export const Default: Story = {};
