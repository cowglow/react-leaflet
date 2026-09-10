import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";
import type { Member, MemberAddress } from "domain/member/member.types.ts";
import type { OrganizationType, DepartmentType } from "domain/shared/types.ts";

export function createMember(firstName: string, lastName: string): Member {
  return {
    id: crypto.randomUUID(),
    name: { firstName, lastName },
    signupDate: new Date().toISOString(),
    status: { kind: "active" },
    incomplete: false,
  };
}

// A placeholder member dropped on the map (Shift+click): a location, no details.
export function createIncompleteMember(coordinates: GeoCoordinate): Member {
  return {
    id: crypto.randomUUID(),
    name: { firstName: "", lastName: "" },
    address: { street: "", number: "", zip: 0, city: "", coordinates },
    signupDate: new Date().toISOString(),
    status: { kind: "active" },
    incomplete: true,
  };
}

export function markComplete(member: Member): Member {
  return { ...member, incomplete: false };
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