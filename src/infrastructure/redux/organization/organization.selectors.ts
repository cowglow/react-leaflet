import type { RootState } from "infrastructure/redux/store.ts";
import type { Organization } from "domain/organization/organization.types.ts";

export function getOrganizations(state: RootState): Organization[] {
  return state.organization.items;
}

export function getOrganizationById(state: RootState, id: string): Organization | undefined {
  return state.organization.items.find((organization) => organization.id === id);
}
