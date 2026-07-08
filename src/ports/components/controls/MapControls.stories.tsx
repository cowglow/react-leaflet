import type { Meta, StoryObj } from "@storybook/react";
import MapControls from "ports/components/controls/MapControls.tsx";
import { sampleMembers } from "ports/testing/story-fixtures.ts";

const meta: Meta<typeof MapControls> = {
  title: "ports/controls/MapControls",
  component: MapControls,
  parameters: {
    map: true,
    reduxState: {
      member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
      auth: {
        status: "authenticated",
        account: { id: "account-1", email: "leader@example.com", role: "leader" },
        error: null,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MapControls>;

// The full control set composed together, matching real App.tsx usage. Most panels
// start collapsed to an icon (matching the real app) — click them to expand.
export const Default: Story = {};
