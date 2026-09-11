import type { Organization, OrganizationInput } from "../../domain/organization/organization.types.js";

// Same shape as MemberRepository — see its comment for why writes are atomic with
// their audit entry internally, and why update/delete signal "not found" with `null`
// rather than a thrown error.
export interface OrganizationRepository {
  findAll(): Promise<Organization[]>;
  findById(id: string): Promise<Organization | null>;
  create(input: OrganizationInput, actorAccountId: string): Promise<Organization>;
  update(id: string, input: OrganizationInput, actorAccountId: string): Promise<Organization | null>;
  delete(id: string, actorAccountId: string): Promise<boolean>;
}
