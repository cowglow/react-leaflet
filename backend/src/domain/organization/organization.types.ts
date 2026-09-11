import type { OrganizationType } from "../shared/types.js";

// Membership is tracked on Member.organizationId, not an embedded list here — see
// infrastructure/prisma/organization.repository.ts's toDomainOrganization, which
// always sets `members` to `[]`. This matches how the frontend's own
// domain/organization/organization.types.ts models it.
export type Organization = {
  id: string;
  name: string;
  type: OrganizationType;
  parentId?: string;
  members: never[];
};

export type OrganizationInput = {
  id?: string;
  name: string;
  type: OrganizationType;
  parentId?: string;
};
