import { DialogType } from "ports/context/app-dialog/app-dialog.types.ts";
import MemberForm from "ports/components/forms/MemberForm.tsx";
import OrganizationForm from "ports/components/forms/OrganizationForm.tsx";
import { JSX } from "react";

export const dialogConfig: Record<DialogType, JSX.Element> = {
  MEMBER_DIALOG: <MemberForm />,
  ORGANIZATION_DIALOG: <OrganizationForm />,
};