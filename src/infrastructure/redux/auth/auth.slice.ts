import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch } from "infrastructure/api/api-client.ts";
import { clearStoredToken, getStoredToken, setStoredToken } from "infrastructure/api/token-storage.ts";

export type Role = "member" | "leader";

export type Account = {
  id: string;
  email: string;
  role: Role;
};

export type AuthState = {
  status: "idle" | "loading" | "authenticated" | "unauthenticated";
  account: Account | null;
  error: string | null;
};

const initialState: AuthState = {
  status: "idle",
  account: null,
  error: null,
};

export const restoreSession = createAsyncThunk("auth/restoreSession", async () => {
  const token = getStoredToken();
  if (!token) {
    return null;
  }
  const { account } = await apiFetch<{ account: Account }>("/auth/me");
  return account;
});

export const requestMagicLink = createAsyncThunk("auth/requestMagicLink", async (email: string) => {
  await apiFetch("/auth/magic-link", { method: "POST", body: JSON.stringify({ email }) });
});

export const verifyMagicLink = createAsyncThunk("auth/verifyMagicLink", async (token: string) => {
  const response = await apiFetch<{ token: string; account: Account }>("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
  setStoredToken(response.token);
  return response.account;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      clearStoredToken();
      return { ...state, status: "unauthenticated" as const, account: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        return { ...state, status: "loading" as const };
      })
      .addCase(restoreSession.fulfilled, (state, action: PayloadAction<Account | null>) => {
        return action.payload
          ? { ...state, status: "authenticated" as const, account: action.payload }
          : { ...state, status: "unauthenticated" as const };
      })
      .addCase(restoreSession.rejected, (state) => {
        clearStoredToken();
        return { ...state, status: "unauthenticated" as const, account: null };
      })
      .addCase(verifyMagicLink.fulfilled, (state, action: PayloadAction<Account>) => {
        return { ...state, status: "authenticated" as const, account: action.payload, error: null };
      })
      .addCase(verifyMagicLink.rejected, (state, action) => {
        return {
          ...state,
          status: "unauthenticated" as const,
          error: action.error.message ?? "Invalid or expired login link",
        };
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
