import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { requestMagicLinkRequested } from "infrastructure/redux/auth/auth.slice.ts";
import { getMagicLinkError, getMagicLinkStatus } from "infrastructure/redux/auth/auth.selectors.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const magicLinkStatus = useSelector(getMagicLinkStatus);
  const magicLinkError = useSelector(getMagicLinkError);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(requestMagicLinkRequested({ email }));
  };

  return (
    <div className="standard-dialog" style={{ maxWidth: "320px", margin: "10vh auto" }}>
      <h2>{t.auth.signIn}</h2>
      {magicLinkStatus === "sent" ? (
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
          {magicLinkStatus === "failed" ? (
            <p role="alert" style={{ color: "firebrick" }}>
              {magicLinkError ?? t.auth.genericError}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
