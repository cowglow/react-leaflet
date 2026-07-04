import { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getAuthStatus } from "infrastructure/redux/auth/auth.selectors.ts";
import { restoreSession, verifyMagicLink } from "infrastructure/redux/auth/auth.slice.ts";
import LoginForm from "ports/components/auth/LoginForm.tsx";

export default function AuthGate({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const status = useSelector(getAuthStatus);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      dispatch(verifyMagicLink(token)).finally(() => {
        params.delete("token");
        const query = params.toString();
        window.history.replaceState({}, "", window.location.pathname + (query ? `?${query}` : ""));
      });
    } else {
      dispatch(restoreSession());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "idle" || status === "loading") {
    return <p>Loading…</p>;
  }

  if (status !== "authenticated") {
    return <LoginForm />;
  }

  return <>{children}</>;
}
