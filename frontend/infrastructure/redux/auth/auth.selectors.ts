import type { RootState } from "infrastructure/redux/store.ts";
import type { Account, Role } from "infrastructure/redux/auth/auth.slice.ts";

export function getAuthStatus(state: RootState) {
  return state.auth.status;
}

export function getAuthError(state: RootState): string | null {
  return state.auth.error;
}

export function getAccount(state: RootState): Account | null {
  return state.auth.account;
}

export function getRole(state: RootState): Role | null {
  return state.auth.account?.role ?? null;
}

export function isLeader(state: RootState): boolean {
  return state.auth.account?.role === "leader";
}

export function getMemberId(state: RootState): string | null {
  return state.auth.account?.memberId ?? null;
}

export function getMagicLinkStatus(state: RootState) {
  return state.auth.magicLinkStatus;
}

export function getMagicLinkError(state: RootState): string | null {
  return state.auth.magicLinkError;
}

export function getInviteStatus(state: RootState) {
  return state.auth.inviteStatus;
}

export function getInviteRequestId(state: RootState): string | null {
  return state.auth.inviteRequestId;
}

export function getInviteError(state: RootState): string | null {
  return state.auth.inviteError;
}
