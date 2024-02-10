type OrganizationType = "Region" | "Headquarter" | "Area" | "District";
type DepartmentType = "MD" | "WD" | "JMD" | "JWD";

type LeadershipType = Record<DepartmentType, Member>;

type Organization = {
  name: string;
  type: OrganizationType;
  members: Member[];
  leadership?: LeadershipType;
};
