import { DialogType } from "context/app-dialog-context/app-dialog-context.type.ts";
import MemberForm from "components/forms/MemberForm.tsx";
import OrganizationForm from "components/forms/OrganizationForm.tsx";
import { JSX } from "react";

export const dialogConfig: Record<DialogType, JSX.Element> = {
  MEMBER_DIALOG: <MemberForm />,
  ORGANIZATION_DIALOG: <OrganizationForm />,
};
