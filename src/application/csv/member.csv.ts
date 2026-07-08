import { convertToCSV } from "application/csv/csv.helpers.ts";
import type { Member, MemberStatus } from "domain/member/member.types.ts";
import type { DepartmentType, OrganizationType } from "domain/shared/types.ts";

const COLUMN_COUNT = 17;

export type MemberCSVRow = {
  id: string;
  firstName: string;
  lastName: string;
  street: string;
  number: string;
  zip: string;
  city: string;
  lat: string;
  lng: string;
  telephone: string;
  email: string;
  responsibilityLevel: string;
  responsibilityType: string;
  organizationId: string;
  signupDate: string;
  statusKind: string;
  lastActiveDate: string;
};

export function memberToCSVRow(member: Member): MemberCSVRow {
  return {
    id: member.id,
    firstName: member.name.firstName,
    lastName: member.name.lastName,
    street: member.address?.street ?? "",
    number: member.address?.number ?? "",
    zip: member.address?.zip?.toString() ?? "",
    city: member.address?.city ?? "",
    lat: member.address ? member.address.coordinates.lat.toString() : "",
    lng: member.address ? member.address.coordinates.lng.toString() : "",
    telephone: member.contact?.telephone ?? "",
    email: member.contact?.email ?? "",
    responsibilityLevel: member.responsibility?.level ?? "",
    responsibilityType: member.responsibility?.type ?? "",
    organizationId: member.organizationId ?? "",
    signupDate: member.signupDate,
    statusKind: member.status.kind,
    lastActiveDate: member.status.kind === "lost-contact" ? member.status.lastActiveDate : "",
  };
}

export function csvRowToMember(row: string[]): Member {
  const [
    id,
    firstName,
    lastName,
    street,
    number,
    zip,
    city,
    lat,
    lng,
    telephone,
    email,
    responsibilityLevel,
    responsibilityType,
    organizationId,
    signupDate,
    statusKind,
    lastActiveDate,
  ] = row;

  const status: MemberStatus =
    statusKind === "lost-contact" ? { kind: "lost-contact", lastActiveDate } : { kind: "active" };

  let member: Member = { id, name: { firstName, lastName }, signupDate, status };

  if (street || number || zip || city || lat || lng) {
    member = {
      ...member,
      address: {
        street,
        number,
        zip: Number(zip),
        city,
        coordinates: { lat: Number(lat), lng: Number(lng) },
      },
    };
  }

  if (telephone || email) {
    member = {
      ...member,
      contact: {
        ...(telephone && { telephone }),
        ...(email && { email }),
      },
    };
  }

  if (responsibilityLevel && responsibilityType) {
    member = {
      ...member,
      responsibility: {
        level: responsibilityLevel as OrganizationType,
        type: responsibilityType as DepartmentType,
      },
    };
  }

  if (organizationId) {
    member = { ...member, organizationId };
  }

  return member;
}

export function membersToCSV(members: Member[]): string {
  return convertToCSV(members.map(memberToCSVRow));
}

export function csvRowsToMembers(rows: string[][]): Member[] {
  return rows.filter((row) => row.length === COLUMN_COUNT).map(csvRowToMember);
}
