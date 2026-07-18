import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { apiFetch, NetworkError } from "infrastructure/api/api-client.ts";
import { clearStoredToken, getStoredToken, setStoredToken } from "infrastructure/api/token-storage.ts";

export type Role = "member" | "leader";

export type Account = {
  id: string;
  email: string;
  role: Role;
  memberId: string | null;
};

export type AuthState = {
  status: "idle" | "loading" | "authenticated" | "unauthenticated" | "offline";
  account: Account | null;
  error: string | null;
};

const initialState: AuthState = {
  status: "idle",
  account: null,
  error: null,
};

export const restoreSession = createAsyncThunk<
  Account | null,
  void,
  { rejectValue: { network: boolean } }
>("auth/restoreSession", async (_arg, { rejectWithValue }) => {
  const token = getStoredToken();
  if (!token) {
    return null;
  }
  try {
    const { account } = await apiFetch<{ account: Account }>("/auth/me");
    return account;
  } catch (error) {
    if (error instanceof NetworkError) {
      // Server unreachable, not "your session is invalid" — don't log the user out
      // over a transient connection issue. Keep the stored token so a retry can
      // pick the session back up once the server is reachable again.
      return rejectWithValue({ network: true });
    }
    throw error;
  }
});

export const requestMagicLink = createAsyncThunk("auth/requestMagicLink", async (email: string) => {
  return await apiFetch<{ message: string; devToken?: string }>("/auth/magic-link", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
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
      .addCase(restoreSession.rejected, (state, action) => {
        if (action.payload?.network) {
          return {
            ...state,
            status: "offline" as const,
            error: "Unable to reach the server. Check your connection and try again.",
          };
        }
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
