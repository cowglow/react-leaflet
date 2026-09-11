import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/test";
import MemberForm from "ports/components/forms/MemberForm.tsx";
import { sampleMembers, sampleOrganizations } from "ports/testing/story-fixtures.ts";

const reduxState = {
  member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
  organization: { items: sampleOrganizations, loading: false, error: null },
};

const meta: Meta<typeof MemberForm> = {
  title: "ports/forms/MemberForm",
  component: MemberForm,
  parameters: { reduxState },
};

export default meta;
type Story = StoryObj<typeof MemberForm>;

export const NoLocationSelected: Story = {
  args: { payload: null },
};

export const AddMode: Story = {
  args: { payload: { coordinates: { lat: 49.4521, lng: 11.0767 } } },
};

export const EditMode: Story = {
  args: { payload: { memberId: "member-1" } },
};

export const EditModeLostContact: Story = {
  args: { payload: { memberId: "member-2" } },
};

export const ConfirmRemove: Story = {
  args: { payload: { memberId: "member-1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Remove" }));
  },
};
