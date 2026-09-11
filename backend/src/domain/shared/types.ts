// Mirrors the Prisma schema's enums by value, deliberately not imported from
// `@prisma/client` — Prisma-generated types are an infrastructure concern (they
// change shape if the ORM or schema-generation strategy ever changes), and domain
// types must have zero framework dependencies. Keep these in sync with
// `prisma/schema.prisma` by hand; a mismatch surfaces immediately as a type error
// where `infrastructure/prisma/*.repository.ts` maps between the two.
export type Role = "member" | "leader";

export type OrganizationType = "Region" | "Headquarter" | "Area" | "District";

export type DepartmentType = "MD" | "WD" | "JMD" | "JWD";
