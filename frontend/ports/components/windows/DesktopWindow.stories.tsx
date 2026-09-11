import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import DesktopWindow from "ports/components/windows/DesktopWindow.tsx";

const meta: Meta<typeof DesktopWindow> = {
  title: "ports/windows/DesktopWindow",
  component: DesktopWindow,
  args: {
    title: "Map",
    onClose: () => {},
    children: <p>Window content goes here.</p>,
  },
};

export default meta;
type Story = StoryObj<typeof DesktopWindow>;

export const Default: Story = {};

export const TitleIsShown: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Map")).toBeInTheDocument();
  },
};

export const ZoomBoxTogglesExpanded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const zoomBox = canvas.getByRole("button", { name: "Resize" });

    await expect(zoomBox).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(zoomBox);
    await expect(zoomBox).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(zoomBox);
    await expect(zoomBox).toHaveAttribute("aria-pressed", "false");
  },
};