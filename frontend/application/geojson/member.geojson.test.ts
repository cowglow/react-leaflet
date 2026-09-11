import { describe, expect, it } from "vitest";
import { membersToGeoJSON } from "application/geojson/member.geojson.ts";
import type { Member } from "domain/member/member.types.ts";

const placed: Member = {
  id: "1",
  name: { firstName: "Ada", lastName: "Lovelace" },
  address: {
    street: "Baker St",
    number: "221B",
    zip: 10000,
    city: "London",
    coordinates: { lat: 51.5237, lng: -0.1585 },
  },
  signupDate: "2024-01-01",
  status: { kind: "active" },
};

const unplaced: Member = {
  id: "2",
  name: { firstName: "Alan", lastName: "Turing" },
  signupDate: "2024-02-02",
  status: { kind: "lost-contact", lastActiveDate: "2024-03-03" },
};

describe("membersToGeoJSON", () => {
  it("wraps members in a FeatureCollection", () => {
    const result = membersToGeoJSON([placed]);
    expect(result.type).toBe("FeatureCollection");
    expect(result.features).toHaveLength(1);
  });

  it("emits a Point in [lng, lat] order for a placed member", () => {
    const [feature] = membersToGeoJSON([placed]).features;
    expect(feature.geometry).toEqual({ type: "Point", coordinates: [-0.1585, 51.5237] });
    expect(feature.properties).toBe(placed);
  });

  it("emits a null geometry for a member with no address", () => {
    const [feature] = membersToGeoJSON([unplaced]).features;
    expect(feature.geometry).toBeNull();
    expect(feature.properties).toBe(unplaced);
  });
});
