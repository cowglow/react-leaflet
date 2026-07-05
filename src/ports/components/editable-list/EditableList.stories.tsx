import type { Meta, StoryObj } from "@storybook/react";
import EditableList from "ports/components/editable-list/EditableList.tsx";

const meta: Meta<typeof EditableList> = {
  title: "ports/editable-list/EditableList",
  component: EditableList,
  parameters: { map: true },
};

export default meta;
type Story = StoryObj<typeof EditableList>;

// Portals its content into the map's bottom-left Leaflet control corner rather than
// rendering inline, so look for it there rather than where this component is mounted.
export const Default: Story = {
  args: { data: { 1: "First item", 2: "Second item" } },
};

export const Empty: Story = {
  args: { data: {} },
};
