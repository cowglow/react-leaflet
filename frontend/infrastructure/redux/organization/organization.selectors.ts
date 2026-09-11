import type { RootState } from "infrastructure/redux/store.ts";
import type { Organization } from "domain/organization/organization.types.ts";

export function getOrganizations(state: RootState): Organization[] {
  return state.organization.items;
}

export function getOrganizationById(state: RootState, id: string): Organization | undefined {
  return state.organization.items.find((organization) => organization.id === id);
}

export function getOrganizationError(state: RootState): string | null {
  return state.organization.error;
}

export function getOrganizationMutationStatus(state: RootState) {
  return state.organization.mutationStatus;
}

export function getOrganizationMutationRequestId(state: RootState): string | null {
  return state.organization.mutationRequestId;
}

export function getOrganizationMutationError(state: RootState): string | null {
  return state.organization.mutationError;
}
