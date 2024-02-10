import { describe, expect, test } from "vitest";
import {
  createAreaOrganization,
  createDistrictOrganization,
  createHeadquartersOrganization,
  createRegionOrganization,
} from "./create-organization.ts";

/*´´
const AliceJohnson: Member = {
  name: { firstName: "Alice", lastName: "Johnson" },
  address: {
    street: "Hauptstraße",
    number: "123",
    zip: 80331,
    city: "München",
    coordinates: [0, 0],
  },
};

const BenjaminLee: Member = {
  name: { firstName: "Benjamin", lastName: "Lee" },
  address: {
    street: "Musterweg",
    number: "456",
    zip: 90402,
    city: "Nürnberg",
    coordinates: [0, 0],
  },
};

const ChloeWilliams: Member = {
  name: { firstName: "Chloe", lastName: "Williams" },
  address: {
    street: "Lindenplatz",
    number: "789",
    zip: 80335,
    city: "München",
    coordinates: [0, 0],
  },
};

const DavidSmith: Member = {
  name: { firstName: "David", lastName: "Smith" },
  address: {
    street: "Rosenallee",
    number: "101",
    zip: 80331,
    city: "München",
    coordinates: [0, 0],
  },
};

const EmilyTaylor: Member = {
  name: { firstName: "Emily", lastName: "Taylor" },
  address: {
    street: "Eichenweg",
    number: "202",
    zip: 80331,
    city: "München",
    coordinates: [0, 0],
  },
};

const FrankRodriguez: Member = {
  name: { firstName: "Frank", lastName: "Rodriguez" },
  address: {
    street: "Ahornstraße",
    number: "303",
    zip: 80331,
    city: "München",
    coordinates: [0, 0],
  },
};

const GraceAnderson: Member = {
  name: { firstName: "Grace", lastName: "Anderson" },
  address: {
    street: "Buchenweg",
    number: "404",
    zip: 80331,
    city: "München",
    coordinates: [0, 0],
  },
};

const HenryTurner: Member = {
  name: { firstName: "Henry", lastName: "Turner" },
  address: {
    street: "Kiefernring",
    number: "505",
    zip: 80331,
    city: "München",
    coordinates: [0, 0],
  },
};

const IsabellaBrown: Member = {
  name: { firstName: "Isabella", lastName: "Brown" },
  address: {
    street: "Ulmenallee",
    number: "606",
    zip: 80331,
    city: "München",
    coordinates: [0, 0],
  },
};
*/
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
