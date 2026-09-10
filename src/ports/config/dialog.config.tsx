import { DialogPayload, DialogType } from "infrastructure/redux/windows/windows.slice.ts";
import MemberForm from "ports/components/forms/MemberForm.tsx";
import OrganizationForm from "ports/components/forms/OrganizationForm.tsx";
import InviteForm from "ports/components/forms/InviteForm.tsx";
import OrganizationTree from "ports/components/organization-tree/OrganizationTree.tsx";
import MapWindow from "ports/components/map/MapWindow.tsx";
import { JSX } from "react";

export const dialogConfig: Record<
  DialogType,
  (payload: DialogPayload | null, z?: number) => JSX.Element
> = {
  MEMBER_DIALOG: (payload) => <MemberForm payload={payload} />,
  ORGANIZATION_DIALOG: (_payload, z) => <OrganizationForm z={z} />,
  INVITE_DIALOG: () => <InviteForm />,
  ORGANIZATION_TREE_DIALOG: (_payload, z) => <OrganizationTree z={z} />,
  MAP_DIALOG: (_payload, z) => <MapWindow z={z} />,
};
