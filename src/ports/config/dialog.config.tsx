import { DialogPayload, DialogType } from "ports/context/app-dialog/app-dialog.types.ts";
import MemberForm from "ports/components/forms/MemberForm.tsx";
import OrganizationForm from "ports/components/forms/OrganizationForm.tsx";
import InviteForm from "ports/components/forms/InviteForm.tsx";
import { JSX } from "react";

export const dialogConfig: Record<DialogType, (payload: DialogPayload | null) => JSX.Element> = {
  MEMBER_DIALOG: (payload) => <MemberForm payload={payload} />,
  ORGANIZATION_DIALOG: () => <OrganizationForm />,
  INVITE_DIALOG: () => <InviteForm />,
};
