import type { RootState } from "infrastructure/redux/store.ts";
import type { Member } from "domain/member/member.types.ts";

export function getMembers(state: RootState): Member[] {
  return state.member.items;
}

export function getFilteredMembers(state: RootState): Member[] {
  return state.member.items.slice(0, state.member.filteredLimit);
}

export function getMembersWithAddress(state: RootState): Member[] {
  return state.member.items.filter((member) => Boolean(member.address));
}

export function getMemberById(state: RootState, id: string): Member | undefined {
  return state.member.items.find((member) => member.id === id);
}

export function getMemberError(state: RootState): string | null {
  return state.member.error;
}

export function getMemberMutationStatus(state: RootState) {
  return state.member.mutationStatus;
}

export function getMemberMutationRequestId(state: RootState): string | null {
  return state.member.mutationRequestId;
}

export function getMemberMutationError(state: RootState): string | null {
  return state.member.mutationError;
}

export function getMemberImportResult(state: RootState) {
  return state.member.importResult;
}
