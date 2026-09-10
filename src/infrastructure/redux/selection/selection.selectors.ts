import type { RootState } from "infrastructure/redux/store.ts";

export function getSelectedMemberIds(state: RootState): string[] {
  return state.selection.memberIds;
}

export function isMemberSelected(state: RootState, id: string): boolean {
  return state.selection.memberIds.includes(id);
}

export function hasSelection(state: RootState): boolean {
  return state.selection.memberIds.length > 0;
}
