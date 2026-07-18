import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { DialogPayload } from "ports/context/app-dialog/app-dialog.types.ts";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { getMemberById } from "infrastructure/redux/member/member.selectors.ts";
import { isLeader } from "infrastructure/redux/auth/auth.selectors.ts";
import { getOrganizations } from "infrastructure/redux/organization/organization.selectors.ts";
import { addMember, removeMember, updateMember } from "infrastructure/redux/member/member.slice.ts";
import {
  assignOrganization,
  createMember,
  markLostContact,
  reactivateMember,
  updateMemberAddress,
  updateMemberEmail,
  updateMemberTelephone,
} from "domain/member/member.factory.ts";
import type { Member, MemberAddress } from "domain/member/member.types.ts";
import DialogWindow from "ports/components/dialogs/DialogWindow.tsx";
import ConfirmDialog from "ports/components/dialogs/ConfirmDialog.tsx";
import "./forms.css";

interface MemberFormProps {
  payload: DialogPayload | null;
}

export default function MemberForm({ payload }: MemberFormProps) {
  const dispatch = useDispatch();
  const { openDialog } = useDialogContext();
  const { t } = useTranslation();
  const organizations = useSelector(getOrganizations);
  const leader = useSelector(isLeader);
  const existingMember = useSelector((state) =>
    payload?.memberId ? getMemberById(state, payload.memberId) : undefined,
  );

  const isEditMode = Boolean(existingMember);
  const coordinates = existingMember?.address?.coordinates ?? payload?.coordinates;

  const [firstName, setFirstName] = useState(existingMember?.name.firstName ?? "");
  const [lastName, setLastName] = useState(existingMember?.name.lastName ?? "");
  const [street, setStreet] = useState(existingMember?.address?.street ?? "");
  const [number, setNumber] = useState(existingMember?.address?.number ?? "");
  const [zip, setZip] = useState(existingMember?.address?.zip?.toString() ?? "");
  const [city, setCity] = useState(existingMember?.address?.city ?? "");
  const [telephone, setTelephone] = useState(existingMember?.contact?.telephone ?? "");
  const [email, setEmail] = useState(existingMember?.contact?.email ?? "");
  const [organizationId, setOrganizationId] = useState(existingMember?.organizationId ?? "");
  const [lostContact, setLostContact] = useState(existingMember?.status.kind === "lost-contact");
  const [lastActiveDate, setLastActiveDate] = useState(
    existingMember?.status.kind === "lost-contact"
      ? existingMember.status.lastActiveDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const title = isEditMode ? t.memberForm.editTitle : t.memberForm.addTitle;

  if (!coordinates) {
    return (
      <DialogWindow title={title} onClose={() => openDialog(null)}>
        <p>{t.memberForm.noLocation}</p>
      </DialogWindow>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    let member: Member = existingMember ? { ...existingMember } : createMember(firstName, lastName);
    member = { ...member, name: { firstName, lastName } };

    const address: MemberAddress = { street, number, zip: Number(zip), city, coordinates };
    member = updateMemberAddress(member, address);
    member = updateMemberTelephone(member, telephone);
    member = updateMemberEmail(member, email);
    member = organizationId ? assignOrganization(member, organizationId) : member;
    member = lostContact ? markLostContact(member, lastActiveDate) : reactivateMember(member);

    try {
      await dispatch(isEditMode ? updateMember(member) : addMember(member)).unwrap();
      openDialog(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : t.memberForm.saveFailed);
    }
  };

  const handleRemove = async () => {
    if (!existingMember) {
      openDialog(null);
      return;
    }
    try {
      await dispatch(removeMember(existingMember.id)).unwrap();
      openDialog(null);
    } catch (error) {
      alert(error instanceof Error ? error.message : t.memberForm.removeFailed);
    }
  };

  if (confirmingRemove && existingMember) {
    return (
      <DialogWindow title={t.memberForm.confirmRemoveTitle} onClose={() => openDialog(null)}>
        <ConfirmDialog
          message={t.memberForm.confirmRemoveMessage(
            `${existingMember.name.firstName} ${existingMember.name.lastName}`,
          )}
          confirmLabel={t.common.remove}
          onConfirm={handleRemove}
          onCancel={() => setConfirmingRemove(false)}
        />
      </DialogWindow>
    );
  }

  return (
    <DialogWindow title={title} onClose={() => openDialog(null)}>
      <form onSubmit={handleSubmit}>
        <div className="field-row field-stack">
          <div className="field-stack">
            <label htmlFor="member-first-name">{t.memberForm.firstName}</label>
            <input
              id="member-first-name"
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div className="field-stack">
            <label htmlFor="member-last-name">{t.memberForm.lastName}</label>
            <input
              id="member-last-name"
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="field-row field-stack">
          <div className="field-stack">
            <label htmlFor="member-street">{t.memberForm.street}</label>
            <input
              id="member-street"
              type="text"
              value={street}
              onChange={(event) => setStreet(event.target.value)}
            />
          </div>
          <div className="field-stack">
            <label htmlFor="member-number">{t.memberForm.number}</label>
            <input
              id="member-number"
              type="text"
              value={number}
              onChange={(event) => setNumber(event.target.value)}
            />
          </div>
        </div>

        <div className="field-row field-stack">
          <div className="field-stack">
            <label htmlFor="member-zip">{t.memberForm.zip}</label>
            <input
              id="member-zip"
              type="text"
              value={zip}
              onChange={(event) => setZip(event.target.value)}
            />
          </div>
          <div className="field-stack">
            <label htmlFor="member-city">{t.memberForm.city}</label>
            <input
              id="member-city"
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </div>
        </div>

        <div className="field-row field-stack">
          <div className="field-stack">
            <label htmlFor="member-telephone">{t.memberForm.telephone}</label>
            <input
              id="member-telephone"
              type="tel"
              value={telephone}
              onChange={(event) => setTelephone(event.target.value)}
            />
          </div>
          <div className="field-stack">
            <label htmlFor="member-email">{t.memberForm.email}</label>
            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="field-stack">
          <label htmlFor="member-organization">
            {t.memberForm.organization}
          </label>
          <select
            id="member-organization"
            value={organizationId}
            onChange={(event) => setOrganizationId(event.target.value)}
          >
            <option value="">{t.memberForm.unassigned}</option>
            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name} ({t.organizationTypes[organization.type]})
              </option>
            ))}
          </select>
        </div>

        <div className="field-row field-stack">
          <input
            id="member-lost-contact"
            type="checkbox"
            checked={lostContact}
            onChange={(event) => setLostContact(event.target.checked)}
          />
          <label htmlFor="member-lost-contact">
            {t.memberForm.lostContact}
          </label>
        </div>

        {lostContact && (
          <div className="field-stack">
            <label htmlFor="member-last-active-date">
              {t.memberForm.lastKnownActive}
            </label>
            <input
              id="member-last-active-date"
              type="date"
              value={lastActiveDate}
              onChange={(event) => setLastActiveDate(event.target.value)}
            />
          </div>
        )}

        <div
          className="field-row field-stack"
          style={{ justifyContent: "flex-end" }}
        >
          <button
            type="button"
            className="btn"
            onClick={() => openDialog(null)}
          >
            {t.common.cancel}
          </button>
          {isEditMode && leader && (
            <button
              type="button"
              className="btn"
              onClick={() => setConfirmingRemove(true)}
            >
              {t.common.remove}
            </button>
          )}
          <button type="submit" className="btn btn-default">
            {t.common.save}
          </button>
        </div>
      </form>
    </DialogWindow>
  );
}
