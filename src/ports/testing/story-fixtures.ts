import type { Member } from "domain/member/member.types.ts";
import type { Organization } from "domain/organization/organization.types.ts";

export const sampleOrganizations: Organization[] = [
  { id: "org-district-1", name: "Nuremberg District", type: "District", members: [] },
  { id: "org-area-1", name: "Bavaria Area", type: "Area", members: [] },
];

export const sampleMembers: Member[] = [
  {
    id: "member-1",
    name: { firstName: "Anna", lastName: "Keller" },
    address: {
      street: "Hauptstraße",
      number: "12",
      zip: 90402,
      city: "Nuremberg",
      coordinates: { lat: 49.4521, lng: 11.0767 },
    },
    contact: { telephone: "+49 911 1234567", email: "anna.keller@example.com" },
    organizationId: "org-district-1",
    signupDate: "2023-04-01T00:00:00.000Z",
    status: { kind: "active" },
  },
  {
    id: "member-2",
    name: { firstName: "Jonas", lastName: "Fischer" },
    address: {
      street: "Bahnhofstraße",
      number: "5",
      zip: 90443,
      city: "Nuremberg",
      coordinates: { lat: 49.4459, lng: 11.0821 },
    },
    contact: { telephone: "+49 911 7654321", email: "jonas.fischer@example.com" },
    organizationId: "org-area-1",
    signupDate: "2022-09-15T00:00:00.000Z",
    status: { kind: "lost-contact", lastActiveDate: "2024-01-10" },
  },
];
