import { PropsWithChildren, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getAuthError, getAuthStatus } from "infrastructure/redux/auth/auth.selectors.ts";
import { restoreSession, verifyMagicLink } from "infrastructure/redux/auth/auth.slice.ts";
import LoginForm from "ports/components/auth/LoginForm.tsx";

export default function AuthGate({ children }: PropsWithChildren) {
  const dispatch = useDispatch();
  const status = useSelector(getAuthStatus);
  const error = useSelector(getAuthError);
  // Magic-link tokens are single-use: React StrictMode's dev-mode double-invoke of
  // this effect would otherwise fire a second /auth/verify with the same token,
  // which the server rejects and which then clobbers the first request's successful
  // login back to unauthenticated.
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) {
      return;
    }
    hasRun.current = true;

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

  if (status === "offline") {
    return (
      <div className="standard-dialog" style={{ maxWidth: "320px", margin: "10vh auto" }}>
        <h2>Can&apos;t connect</h2>
        <p>{error}</p>
        <button type="button" className="btn" onClick={() => dispatch(restoreSession())}>
          Retry
        </button>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <LoginForm />;
  }

  return <>{children}</>;
}
