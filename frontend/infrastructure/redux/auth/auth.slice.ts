import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearStoredToken } from "infrastructure/api/token-storage.ts";
import type { MutationStatus } from "infrastructure/redux/mutation-status.ts";

export type Role = "member" | "leader";

export type Account = {
  id: string;
  email: string;
  role: Role;
  memberId: string | null;
};

export type MagicLinkStatus = "idle" | "pending" | "sent" | "failed";

export type AuthState = {
  status: "idle" | "loading" | "authenticated" | "unauthenticated" | "offline";
  account: Account | null;
  error: string | null;
  magicLinkStatus: MagicLinkStatus;
  magicLinkError: string | null;
  inviteRequestId: string | null;
  inviteStatus: MutationStatus;
  inviteError: string | null;
};

const initialState: AuthState = {
  status: "idle",
  account: null,
  error: null,
  magicLinkStatus: "idle",
  magicLinkError: null,
  inviteRequestId: null,
  inviteStatus: "idle",
  inviteError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      clearStoredToken();
      return { ...state, status: "unauthenticated" as const, account: null };
    },
    restoreSessionRequested(state) {
      return { ...state, status: "loading" as const };
    },
    restoreSessionSucceeded(state, action: PayloadAction<Account | null>) {
      return action.payload
        ? { ...state, status: "authenticated" as const, account: action.payload }
        : { ...state, status: "unauthenticated" as const };
    },
    restoreSessionFailed(state, action: PayloadAction<{ network: boolean }>) {
      if (action.payload.network) {
        // Server unreachable, not "your session is invalid" — don't log the user
        // out over a transient connection issue. Keep the stored token so a retry
        // can pick the session back up once the server is reachable again.
        return {
          ...state,
          status: "offline" as const,
          error: "Unable to reach the server. Check your connection and try again.",
        };
      }
      clearStoredToken();
      return { ...state, status: "unauthenticated" as const, account: null };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestMagicLinkRequested(state, _action: PayloadAction<{ email: string }>) {
      return { ...state, magicLinkStatus: "pending" as const, magicLinkError: null };
    },
    requestMagicLinkSucceeded(state) {
      // The API always responds the same way whether or not the account exists
      // (to avoid leaking which emails are registered), so reaching here is a
      // genuine "check your email" success.
      return { ...state, magicLinkStatus: "sent" as const };
    },
    requestMagicLinkFailed(state, action: PayloadAction<string>) {
      return { ...state, magicLinkStatus: "failed" as const, magicLinkError: action.payload };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verifyMagicLinkRequested(state, _action: PayloadAction<{ token: string }>) {
      return { ...state, status: "loading" as const };
    },
    verifyMagicLinkSucceeded(state, action: PayloadAction<Account>) {
      return { ...state, status: "authenticated" as const, account: action.payload, error: null };
    },
    verifyMagicLinkFailed(state, action: PayloadAction<string>) {
      return { ...state, status: "unauthenticated" as const, error: action.payload };
    },
    inviteAccountRequested(
      state,
      action: PayloadAction<{ requestId: string; email: string; role: Role; memberId?: string }>,
    ) {
      return {
        ...state,
        inviteRequestId: action.payload.requestId,
        inviteStatus: "pending" as const,
        inviteError: null,
      };
    },
    inviteAccountSucceeded(state, action: PayloadAction<{ requestId: string }>) {
      return { ...state, inviteRequestId: action.payload.requestId, inviteStatus: "succeeded" as const };
    },
    inviteAccountFailed(state, action: PayloadAction<{ requestId: string; error: string }>) {
      return {
        ...state,
        inviteRequestId: action.payload.requestId,
        inviteStatus: "failed" as const,
        inviteError: action.payload.error,
      };
    },
    resetInviteAccount(state) {
      return { ...state, inviteRequestId: null, inviteStatus: "idle" as const, inviteError: null };
    },
  },
});

export const {
  logout,
  restoreSessionRequested,
  restoreSessionSucceeded,
  restoreSessionFailed,
  requestMagicLinkRequested,
  requestMagicLinkSucceeded,
  requestMagicLinkFailed,
  verifyMagicLinkRequested,
  verifyMagicLinkSucceeded,
  verifyMagicLinkFailed,
  inviteAccountRequested,
  inviteAccountSucceeded,
  inviteAccountFailed,
  resetInviteAccount,
} = authSlice.actions;
export default authSlice.reducer;
