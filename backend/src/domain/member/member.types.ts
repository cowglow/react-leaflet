import type { DepartmentType, OrganizationType } from "../shared/types.js";

export type MemberStatus = { kind: "active" } | { kind: "lost-contact"; lastActiveDate: string };

export type MemberAddress = {
  street: string;
  number: string;
  zip: number;
  city: string;
  coordinates: { lat: number; lng: number };
};

// The shape the API request/response bodies use — this is also exactly the shape
// the frontend's own `domain/member/member.types.ts` works with, so the mapping
// layer (`infrastructure/prisma/member.repository.ts`) is the only place either
// side's flat Prisma columns ever leak into.
export type Member = {
  id: string;
  name: { firstName: string; lastName: string };
  address?: MemberAddress;
  contact?: { telephone?: string; email?: string };
  responsibility?: { level: OrganizationType; type: DepartmentType };
  organizationId?: string;
  signupDate: string;
  status: MemberStatus;
  incomplete: boolean;
};

export type MemberInput = {
  id?: string;
  name: { firstName: string; lastName: string };
  address?: MemberAddress;
  contact?: { telephone?: string; email?: string };
  responsibility?: { level: OrganizationType; type: DepartmentType };
  organizationId?: string;
  status: MemberStatus;
  incomplete?: boolean;
};
