import { beforeEach, describe, expect, test } from "vitest";
import {
  createMember,
  updateMemberAddress,
  updateMemberEmail,
  updateMemberTelephone,
  updateResponsibility,
} from "./create-member.ts";

const mockMemberName = {
  firstName: "Alice",
  lastName: "Johnson",
};

const mockMemberAddress = {
  street: "Hauptstraße",
  number: "123 B",
  zip: 80331,
  city: "München",
  coordinates: [0, 0] as L.LatLngTuple,
};

const mockMemberContact = {
  telephone: "0508710915",
  email: "foo@bar.com",
};

const mockMember = {
  name: {
    firstName: mockMemberName[0],
    lastName: mockMemberName[1],
  },
  address: mockMemberAddress,
  contact: mockMemberContact,
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
    expect(testMember.address).toEqual(mockMember.address);
  });

  test("Update Member's Contact", () => {
    testMember = updateMemberTelephone(testMember, mockMemberContact.telephone);
    expect(testMember.contact.telephone).toEqual(mockMember.contact.telephone);
    testMember = updateMemberEmail(testMember, mockMemberContact.email);
    expect(testMember.contact.email).toEqual(mockMember.contact.email);
  });

  test("Add District Responsibility to Member", () => {
    testMember = updateResponsibility(testMember, "District", "MD");
    expect(testMember.responsibility.level).toBe("District");
    expect(testMember.responsibility.type).toBe("MD");
  });
});
