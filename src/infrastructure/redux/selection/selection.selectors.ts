import type { RootState } from "infrastructure/redux/store.ts";
import type { Member } from "domain/member/member.types.ts";

export function getSelectedMemberIds(state: RootState): string[] {
  return state.selection.memberIds;
}

export function isMemberSelected(state: RootState, id: string): boolean {
  return state.selection.memberIds.includes(id);
}

export function hasSelection(state: RootState): boolean {
  return state.selection.memberIds.length > 0;
}

export function getSelectionCount(state: RootState): number {
  return state.selection.memberIds.length;
}

export function getSelectedMembers(state: RootState): Member[] {
  const ids = new Set(state.selection.memberIds);
  return state.member.items.filter((member) => ids.has(member.id));
}
