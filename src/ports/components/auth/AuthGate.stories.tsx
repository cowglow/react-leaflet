import type { Meta, StoryObj } from "@storybook/react";
import AuthGate from "ports/components/auth/AuthGate.tsx";

const meta: Meta<typeof AuthGate> = {
  title: "ports/auth/AuthGate",
  component: AuthGate,
  args: {
    children: <div style={{ padding: "1rem" }}>Protected app content</div>,
  },
};

export default meta;
type Story = StoryObj<typeof AuthGate>;

// AuthGate always dispatches restoreSession() on mount, which — with no stored token in a
// fresh Storybook session — resolves to "unauthenticated" and self-corrects shortly after
// paint. So Loading/Authenticated/Offline below render correctly on first paint but may
// flip to the LoginForm a moment later; Unauthenticated is the one story stable long-term.
export const Loading: Story = {
  parameters: { reduxState: { auth: { status: "loading", account: null, error: null } } },
};

export const Unauthenticated: Story = {
  parameters: { reduxState: { auth: { status: "unauthenticated", account: null, error: null } } },
};

export const Offline: Story = {
  parameters: {
    reduxState: {
      auth: {
        status: "offline",
        account: null,
        error: "Unable to reach the server. Check your connection and try again.",
      },
    },
  },
};

export const Authenticated: Story = {
  parameters: {
    reduxState: {
      auth: {
        status: "authenticated",
        account: { id: "account-1", email: "leader@example.com", role: "leader" },
        error: null,
      },
    },
  },
};
