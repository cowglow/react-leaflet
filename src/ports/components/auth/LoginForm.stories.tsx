import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import LoginForm from "ports/components/auth/LoginForm.tsx";

const meta: Meta<typeof LoginForm> = {
  title: "ports/auth/LoginForm",
  component: LoginForm,
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

// There's no real backend in Storybook, so the request can't succeed — this should
// surface as a visible error, not silently claim the link was sent (see LoginForm.tsx).
export const RequestFailed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Email"), "member@example.com");
    await userEvent.click(canvas.getByRole("button", { name: "Send login link" }));
    await expect(await canvas.findByRole("alert")).toBeInTheDocument();
  },
};
