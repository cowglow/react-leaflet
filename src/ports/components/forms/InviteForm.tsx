import { FormEvent, useState } from "react";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { apiFetch } from "infrastructure/api/api-client.ts";
import type { Role } from "infrastructure/redux/auth/auth.slice.ts";

export default function InviteForm() {
  const { openDialog } = useDialogContext();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await apiFetch("/auth/invite", { method: "POST", body: JSON.stringify({ email, role }) });
      setSent(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to invite account");
    }
  };

  return (
    <div className="standard-dialog">
      <h2>Invite Account</h2>
      {sent ? (
        <>
          <p>
            Invited {email} as {role}. They can now request a login link with that
            email.
          </p>
          <button type="button" className="btn" onClick={() => openDialog(null)}>
            Close
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="invite-email">Email</label>
          <br />
          <input
            id="invite-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <br />

          <label htmlFor="invite-role">Role</label>
          <br />
          <select
            id="invite-role"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            <option value="member">Member (read-only)</option>
            <option value="leader">Leader (read + write)</option>
          </select>
          <br />

          <button type="submit" className="btn">
            Send invite
          </button>
          &nbsp;
          <button type="button" className="btn" onClick={() => openDialog(null)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
