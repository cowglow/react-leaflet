export function createMember(firstName: string, lastName: string): Member {
  return {
    name: { firstName, lastName },
  };
}

export function updateMemberAddress(
  member: Member,
  address: MemberAddress,
): Member {
  return {
    ...member,
    address: {
      ...address,
    },
  };
}

export function updateMemberTelephone(
  member: Member,
  telephone: string,
): Member {
  return {
    ...member,
    contact: {
      telephone,
    },
  };
}

export function updateMemberEmail(member: Member, email: string): Member {
  return {
    ...member,
    contact: {
      email,
    },
  };
}

export function updateResponsibility(
  member: Member,
  level: OrganizationType,
  department: DepartmentType,
): Member {
  return {
    ...member,
    responsibility: {
      level,
      type: department,
    },
  };
}
