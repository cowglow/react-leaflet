import type { Member, MemberAddress } from "domain/member/member.types.ts";
import type { OrganizationType, DepartmentType } from "domain/shared/types.ts";

export function createMember(firstName: string, lastName: string): Member {
  return {
    id: crypto.randomUUID(),
    name: { firstName, lastName },
    signupDate: new Date().toISOString(),
    status: { kind: "active" },
  };
}

export function updateMemberAddress(member: Member, address: MemberAddress): Member {
  return { ...member, address: { ...address } };
}

export function updateMemberTelephone(member: Member, telephone: string): Member {
  return { ...member, contact: { ...member.contact, telephone } };
}

export function updateMemberEmail(member: Member, email: string): Member {
  return { ...member, contact: { ...member.contact, email } };
}

export function updateResponsibility(
  member: Member,
  level: OrganizationType,
  department: DepartmentType,
): Member {
  return { ...member, responsibility: { level, type: department } };
}

export function assignOrganization(member: Member, organizationId: string): Member {
  return { ...member, organizationId };
}

export function markLostContact(member: Member, lastActiveDate: string): Member {
  return { ...member, status: { kind: "lost-contact", lastActiveDate } };
}

export function reactivateMember(member: Member): Member {
  return { ...member, status: { kind: "active" } };
}