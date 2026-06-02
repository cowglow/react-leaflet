import { describe, expect, test } from "vitest";
import {
  createAreaOrganization,
  createDistrictOrganization,
  createHeadquartersOrganization,
  createRegionOrganization,
} from "domain/organization/organization.factory.ts";

describe("Create Organizations", () => {
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