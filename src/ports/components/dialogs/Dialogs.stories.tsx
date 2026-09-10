import type { Meta, StoryObj } from "@storybook/react";
import Dialogs from "ports/components/dialogs/Dialogs.tsx";
import type { DialogPayload, DialogType } from "infrastructure/redux/windows/windows.slice.ts";
import { sampleMembers, sampleOrganizations } from "ports/testing/story-fixtures.ts";

const baseReduxState = {
  member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
  organization: { items: sampleOrganizations, loading: false, error: null },
};

function withOpenWindow(type: DialogType, payload: DialogPayload | null = null) {
  return {
    ...baseReduxState,
    windows: { items: [{ id: type, type, payload }] },
  };
}

const meta: Meta<typeof Dialogs> = {
  title: "ports/dialogs/Dialogs",
  component: Dialogs,
  parameters: { reduxState: baseReduxState },
};

export default meta;
type Story = StoryObj<typeof Dialogs>;

export const Closed: Story = {};

export const MemberDialog: Story = {
  parameters: { reduxState: withOpenWindow("MEMBER_DIALOG", { memberId: "member-1" }) },
};

export const OrganizationDialog: Story = {
  parameters: { reduxState: withOpenWindow("ORGANIZATION_DIALOG") },
};

export const InviteDialog: Story = {
  parameters: { reduxState: withOpenWindow("INVITE_DIALOG") },
};
