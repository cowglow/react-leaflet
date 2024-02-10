type Member = {
  name: MemberName;
  address?: MemberAddress;
  contact?: Partial<MemberContact>;
  responsibility?: MemberResponsibilityRole;
};

type MemberName = {
  firstName: string;
  lastName: string;
};

type MemberAddress = {
  street: string;
  number: string;
  zip: number;
  city: string;
  coordinates: L.LatLngExpression;
};

type MemberContact = {
  telephone: string;
  email: string;
};

type MemberResponsibilityRole = {
  level: OrganizationType;
  type: DepartmentType;
};
