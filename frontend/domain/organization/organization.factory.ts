import type { Organization } from "domain/organization/organization.types.ts";
import type { Member } from "domain/member/member.types.ts";
import type { OrganizationType } from "domain/shared/types.ts";

type AreaDistricts = Array<Organization & { type: "District" }>;
type HeadquartersAreas = Array<Organization & { type: "Area" }>;
type RegionHeadquarters = Array<Organization & { type: "Headquarter" }>;

type InheritedMembers = AreaDistricts | HeadquartersAreas | RegionHeadquarters;
const getMembers = (organization: InheritedMembers): Member[] =>
  organization.flatMap(({ members }) => members);

function buildOrganization(args: Omit<Organization, "id">): Organization {
  return {
    id: crypto.randomUUID(),
    name: args.name,
    type: args.type,
    members: args.members,
    leadership: args.leadership,
  };
}

export function createOrganization(name: string, type: OrganizationType): Organization {
  return buildOrganization({ name, type, members: [] });
}

export function createDistrictOrganization(name: string, members: Member[]): Organization {
  return buildOrganization({ name, type: "District", members });
}

export function createAreaOrganization(name: string, districts: AreaDistricts): Organization {
  return buildOrganization({ name, type: "Area", members: getMembers(districts) });
}

export function createHeadquartersOrganization(name: string, areas: HeadquartersAreas): Organization {
  return buildOrganization({ name, type: "Headquarter", members: getMembers(areas) });
}

export function createRegionOrganization(name: string, headquarters: RegionHeadquarters): Organization {
  return buildOrganization({ name, type: "Region", members: getMembers(headquarters) });
}