import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import Dialogs from "ports/components/dialogs/Dialogs.tsx";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import type { DialogPayload, DialogType } from "ports/context/app-dialog/app-dialog.types.ts";
import { sampleMembers, sampleOrganizations } from "ports/testing/story-fixtures.ts";

const reduxState = {
  member: { items: sampleMembers, filteredLimit: sampleMembers.length, loading: false, error: null },
  organization: { items: sampleOrganizations, loading: false, error: null },
};

function OpenOnMount({ dialog, payload }: { dialog: DialogType; payload?: DialogPayload | null }) {
  const { openDialog } = useDialogContext();
  useEffect(() => {
    openDialog(dialog, payload ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Dialogs />;
}

const meta: Meta<typeof Dialogs> = {
  title: "ports/dialogs/Dialogs",
  component: Dialogs,
  parameters: { reduxState },
};

export default meta;
type Story = StoryObj<typeof Dialogs>;

export const Closed: Story = {};

export const MemberDialog: Story = {
  render: () => <OpenOnMount dialog="MEMBER_DIALOG" payload={{ memberId: "member-1" }} />,
};

export const OrganizationDialog: Story = {
  render: () => <OpenOnMount dialog="ORGANIZATION_DIALOG" />,
};

export const InviteDialog: Story = {
  render: () => <OpenOnMount dialog="INVITE_DIALOG" />,
};
