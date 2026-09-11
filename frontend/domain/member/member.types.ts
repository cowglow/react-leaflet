import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";
import type { OrganizationType, DepartmentType } from "domain/shared/types.ts";

export type MemberName = {
  firstName: string;
  lastName: string;
};

export type MemberAddress = {
  street: string;
  number: string;
  zip: number;
  city: string;
  coordinates: GeoCoordinate;
};

export type MemberContact = {
  telephone: string;
  email: string;
};

export type MemberResponsibilityRole = {
  level: OrganizationType;
  type: DepartmentType;
};

export type MemberStatus =
  | { kind: "active" }
  | { kind: "lost-contact"; lastActiveDate: string };

export type Member = {
  id: string;
  name: MemberName;
  address?: MemberAddress;
  contact?: Partial<MemberContact>;
  responsibility?: MemberResponsibilityRole;
  organizationId?: string;
  signupDate: string;
  status: MemberStatus;
  // A member dropped on the map as a placeholder — has a location but no real
  // details yet. Cleared once the Member form is saved for it.
  incomplete?: boolean;
};