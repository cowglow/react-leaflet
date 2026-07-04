import { describe, expect, test } from "vitest";
import {
  createAreaOrganization,
  createDistrictOrganization,
  createHeadquartersOrganization,
  createOrganization,
  createRegionOrganization,
} from "domain/organization/organization.factory.ts";

describe("Create Organizations", () => {
  test("Create a flat Organization entity with a unique id", () => {
    const a = createOrganization("District A", "District");
    const b = createOrganization("District B", "District");
    expect(a.id).toEqual(expect.any(String));
    expect(a.id).not.toEqual(b.id);
    expect(a.members).toEqual([]);
  });

  test("Create District", () => {
    const result = createDistrictOrganization("District A", []);
    expect(result.type).toBe("District");
  });

  test("Create Area", () => {
    const result = createAreaOrganization("Area A", []);
    expect(result.type).toBe("Area");
  });

  test("Create Headquarter", () => {
    const result = createHeadquartersOrganization("HQ West", []);
    console.log(result);
    expect(result.type).toBe("Headquarter");
  });

  test("Create Region", () => {
    const result = createRegionOrganization("South", []);
    expect(result.type).toBe("Region");
  });
});