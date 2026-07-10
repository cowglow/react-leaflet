import { FormEvent, useState } from "react";
import { useDispatch } from "infrastructure/redux/hooks.ts";
import { requestMagicLink, verifyMagicLink } from "infrastructure/redux/auth/auth.slice.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const result = await dispatch(requestMagicLink(email)).unwrap();
      if (result.devToken) {
        // No real email provider outside production — skip straight to signed-in
        // instead of making the developer go find the token in the console.
        await dispatch(verifyMagicLink(result.devToken));
        return;
      }
      // The API always responds the same way whether or not the account exists
      // (to avoid leaking which emails are registered), so reaching here is a
      // genuine success — only a thrown error below means the request itself failed.
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.auth.genericError);
    }
  };

  return (
    <div className="standard-dialog" style={{ maxWidth: "320px", margin: "10vh auto" }}>
      <h2>{t.auth.signIn}</h2>
      {sent ? (
        <p>{t.auth.linkSent}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">{t.auth.email}</label>
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
            {t.auth.sendLoginLink}
          </button>
          {error ? (
            <p role="alert" style={{ color: "firebrick" }}>
              {error}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
