import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import DialogWindow from "ports/components/dialogs/DialogWindow.tsx";

const meta: Meta<typeof DialogWindow> = {
  title: "ports/dialogs/DialogWindow",
  component: DialogWindow,
  args: {
    title: "Add Member",
    onClose: fn(),
    children: <p>Dialog content goes here.</p>,
  },
};

export default meta;
type Story = StoryObj<typeof DialogWindow>;

export const Default: Story = {};

export const CloseClicked: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Close" }));
    await expect(args.onClose).toHaveBeenCalled();
  },
};
