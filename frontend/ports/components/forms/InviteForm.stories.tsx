import type { Meta, StoryObj } from "@storybook/react";
import InviteForm from "ports/components/forms/InviteForm.tsx";

const meta: Meta<typeof InviteForm> = {
  title: "ports/forms/InviteForm",
  component: InviteForm,
};

export default meta;
type Story = StoryObj<typeof InviteForm>;

// No "Sent" story: submitting for real dispatches a saga that calls
// POST /auth/invite, and a failed request triggers a blocking window.alert() — not
// safe to auto-trigger via play().
export const Default: Story = {};
