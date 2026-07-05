import type { Meta, StoryObj } from "@storybook/react";
import ConnectionErrorBanner from "ports/components/ui/ConnectionErrorBanner.tsx";

const meta: Meta<typeof ConnectionErrorBanner> = {
  title: "ports/ui/ConnectionErrorBanner",
  component: ConnectionErrorBanner,
  args: {
    message: "Couldn't load data: Network request failed",
    onRetry: () => alert("Retry clicked"),
  },
};

export default meta;
type Story = StoryObj<typeof ConnectionErrorBanner>;

export const Default: Story = {};

export const LongMessage: Story = {
  args: {
    message:
      "Couldn't load data: the server at api.example.com timed out after 30 seconds. Check your connection and try again.",
  },
};
