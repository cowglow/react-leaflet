type AreaDistricts = Array<Organization & { type: "District" }>;
type HeadquartersAreas = Array<Organization & { type: "Area" }>;
type RegionHeadquarters = Array<Organization & { type: "Headquarter" }>;

type InheritedMembers = AreaDistricts | HeadquartersAreas | RegionHeadquarters;
const getMembers = (organization: InheritedMembers) =>
  organization.flatMap(({ members }) => members);

function createOrganization(args: Organization): Organization {
  return {
    name: args["name"],
    type: args["type"],
    members: args["members"],
    leadership: args["leadership"],
  };
}

export function createDistrictOrganization(
  name: string,
  members: Member[],
): Organization {
  return createOrganization({
    name,
    type: "District",
    members,
  });
}

export function createAreaOrganization(
  name: string,
  districts: AreaDistricts,
): Organization {
  const areaMembers = getMembers(districts);
  return createOrganization({
    name,
    type: "Area",
    members: areaMembers,
  });
}

export function createHeadquartersOrganization(
  name: string,
  areas: HeadquartersAreas,
): Organization {
  const headquartersMembers = getMembers(areas);
  return createOrganization({
    name,
    type: "Headquarter",
    members: headquartersMembers,
  });
}

export function createRegionOrganization(
  name: string,
  headquarters: RegionHeadquarters,
): Organization {
  const regionMembers = getMembers(headquarters);
  return {
    name,
    type: "Region",
    members: regionMembers,
  };
}
