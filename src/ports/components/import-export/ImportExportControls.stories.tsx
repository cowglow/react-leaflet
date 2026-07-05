import type { Meta, StoryObj } from "@storybook/react";
import ImportExportControls from "ports/components/import-export/ImportExportControls.tsx";
import LayerControl from "ports/components/controls/LayerControl.tsx";
import { sampleMembers } from "ports/testing/story-fixtures.ts";

const meta: Meta<typeof ImportExportControls> = {
  title: "ports/import-export/ImportExportControls",
  component: ImportExportControls,
  parameters: {
    map: true,
    reduxState: {
      member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
    },
  },
  // Matches its real position from MapControls.tsx (bottomRight, always open).
  decorators: [
    (Story) => (
      <LayerControl position="bottomRight" noIcon={true}>
        <Story />
      </LayerControl>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ImportExportControls>;

export const Default: Story = {};
