import { beforeEach, describe, expect, test } from "vitest";
import {
  createMember,
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

  test("Update Member's Address", () => {
    testMember = updateMemberAddress(testMember, mockMemberAddress);
    expect(testMember.address).toEqual(mockMemberAddress);
  });

  test("Update Member's Contact", () => {
    testMember = updateMemberTelephone(testMember, mockMemberContact.telephone);
    expect(testMember.contact.telephone).toEqual(mockMemberContact.telephone);
    testMember = updateMemberEmail(testMember, mockMemberContact.email);
    expect(testMember.contact.email).toEqual(mockMemberContact.email);
  });

  test("Add District Responsibility to Member", () => {
    testMember = updateResponsibility(testMember, "District", "MD");
    expect(testMember.responsibility.level).toBe("District");
    expect(testMember.responsibility.type).toBe("MD");
  });
});