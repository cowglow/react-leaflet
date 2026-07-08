import { beforeEach, describe, expect, test } from "vitest";
import {
  assignOrganization,
  createMember,
  markLostContact,
  reactivateMember,
  updateMemberAddress,
  updateMemberEmail,
  updateMemberTelephone,
  updateResponsibility,
} from "domain/member/member.factory.ts";
import type { Member, MemberAddress } from "domain/member/member.types.ts";

const mockMemberName = { firstName: "Alice", lastName: "Johnson" };

const mockMemberAddress: MemberAddress = {
  street: "Hauptstraße",
  number: "123 B",
  zip: 80331,
  city: "München",
  coordinates: { lat: 0, lng: 0 },
};

const mockMemberContact = {
  telephone: "0508710915",
  email: "foo@bar.com",
};

let testMember: Member;

describe("Create Member", () => {
  beforeEach(() => {
    const { firstName, lastName } = mockMemberName;
    testMember = createMember(firstName, lastName);
  });

  test("Create member with name only", () => {
    expect(testMember.name).toEqual({
      firstName: mockMemberName.firstName,
      lastName: mockMemberName.lastName,
    });
  });

  test("Create member gets a unique id, a signup date, and active status", () => {
    const otherMember = createMember("Bob", "Smith");
    expect(testMember.id).toEqual(expect.any(String));
    expect(testMember.id).not.toEqual(otherMember.id);
    expect(testMember.signupDate).toEqual(expect.any(String));
    expect(testMember.status).toEqual({ kind: "active" });
  });

  test("Update Member's Address", () => {
    testMember = updateMemberAddress(testMember, mockMemberAddress);
    expect(testMember.address).toEqual(mockMemberAddress);
  });

  test("Update Member's Contact merges rather than replaces", () => {
    testMember = updateMemberTelephone(testMember, mockMemberContact.telephone);
    expect(testMember.contact.telephone).toEqual(mockMemberContact.telephone);
    testMember = updateMemberEmail(testMember, mockMemberContact.email);
    expect(testMember.contact.email).toEqual(mockMemberContact.email);
    expect(testMember.contact.telephone).toEqual(mockMemberContact.telephone);
  });

  test("Add District Responsibility to Member", () => {
    testMember = updateResponsibility(testMember, "District", "MD");
    expect(testMember.responsibility.level).toBe("District");
    expect(testMember.responsibility.type).toBe("MD");
  });

  test("Assign Member to an Organization", () => {
    testMember = assignOrganization(testMember, "org-1");
    expect(testMember.organizationId).toBe("org-1");
  });

  test("Mark Member as lost contact and reactivate", () => {
    testMember = markLostContact(testMember, "2026-01-01");
    expect(testMember.status).toEqual({ kind: "lost-contact", lastActiveDate: "2026-01-01" });
    testMember = reactivateMember(testMember);
    expect(testMember.status).toEqual({ kind: "active" });
  });
});