import type { Organization } from "domain/organization/organization.types.ts";
import type { Member } from "domain/member/member.types.ts";

type AreaDistricts = Array<Organization & { type: "District" }>;
type HeadquartersAreas = Array<Organization & { type: "Area" }>;
type RegionHeadquarters = Array<Organization & { type: "Headquarter" }>;

type InheritedMembers = AreaDistricts | HeadquartersAreas | RegionHeadquarters;
const getMembers = (organization: InheritedMembers): Member[] =>
  organization.flatMap(({ members }) => members);

function createOrganization(args: Organization): Organization {
  return { name: args.name, type: args.type, members: args.members, leadership: args.leadership };
}

export function createDistrictOrganization(name: string, members: Member[]): Organization {
  return createOrganization({ name, type: "District", members });
}

export function createAreaOrganization(name: string, districts: AreaDistricts): Organization {
  return createOrganization({ name, type: "Area", members: getMembers(districts) });
}

export function createHeadquartersOrganization(name: string, areas: HeadquartersAreas): Organization {
  return createOrganization({ name, type: "Headquarter", members: getMembers(areas) });
}

export function createRegionOrganization(name: string, headquarters: RegionHeadquarters): Organization {
  return { name, type: "Region", members: getMembers(headquarters) };
}