import type { Member } from "domain/member/member.types.ts";
import type { OrganizationType, DepartmentType } from "domain/shared/types.ts";

export type LeadershipType = Record<DepartmentType, Member>;

export type Organization = {
  name: string;
  type: OrganizationType;
  members: Member[];
  leadership?: LeadershipType;
};