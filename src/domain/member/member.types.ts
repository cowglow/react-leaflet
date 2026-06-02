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

export type Member = {
  name: MemberName;
  address?: MemberAddress;
  contact?: Partial<MemberContact>;
  responsibility?: MemberResponsibilityRole;
};