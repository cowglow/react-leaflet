import { FormEvent, useState } from "react";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { apiFetch } from "infrastructure/api/api-client.ts";
import type { Role } from "infrastructure/redux/auth/auth.slice.ts";
import DialogWindow from "ports/components/dialogs/DialogWindow.tsx";
import "./forms.css";

export default function InviteForm() {
  const { openDialog } = useDialogContext();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await apiFetch("/auth/invite", { method: "POST", body: JSON.stringify({ email, role }) });
      setSent(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : t.inviteForm.inviteFailed);
    }
  };

  const roleLabel = role === "leader" ? t.inviteForm.roleLeader : t.inviteForm.roleMember;

  return (
    <DialogWindow title={t.inviteForm.title} onClose={() => openDialog(null)}>
      {sent ? (
        <>
          <p>{t.inviteForm.invited(email, roleLabel)}</p>
          <div className="field-row field-stack">
            <button type="button" className="btn" onClick={() => openDialog(null)}>
              {t.common.close}
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field-stack">
            <label htmlFor="invite-email">{t.inviteForm.email}</label>
            <input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="field-stack">
            <label htmlFor="invite-role">{t.inviteForm.role}</label>
            <select
              id="invite-role"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
            >
              <option value="member">{t.inviteForm.roleMember}</option>
              <option value="leader">{t.inviteForm.roleLeader}</option>
            </select>
          </div>

          <div className="field-row field-stack">
            <button type="submit" className="btn">
              {t.inviteForm.sendInvite}
            </button>
            <button type="button" className="btn" onClick={() => openDialog(null)}>
              {t.common.cancel}
            </button>
          </div>
        </form>
      )}
    </DialogWindow>
  );
}
