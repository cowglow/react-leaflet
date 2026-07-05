import { FormEvent, useState } from "react";
import { useDispatch } from "infrastructure/redux/hooks.ts";
import { requestMagicLink, verifyMagicLink } from "infrastructure/redux/auth/auth.slice.ts";

export default function LoginForm() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const result = await dispatch(requestMagicLink(email)).unwrap();
      if (result.devToken) {
        // No real email provider outside production — skip straight to signed-in
        // instead of making the developer go find the token in the console.
        await dispatch(verifyMagicLink(result.devToken));
        return;
      }
    } catch {
      // fall through to the generic "sent" message below
    }
    setSent(true);
  };

  return (
    <div className="standard-dialog" style={{ maxWidth: "320px", margin: "10vh auto" }}>
      <h2>Sign in</h2>
      {sent ? (
        <p>
          If that email has an account, a login link has been sent. Check your inbox
          (or the server console in dev).
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <br />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <br />
          <button type="submit" className="btn">
            Send login link
          </button>
        </form>
      )}
    </div>
  );
}
