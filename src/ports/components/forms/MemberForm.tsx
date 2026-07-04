import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { DialogPayload } from "ports/context/app-dialog/app-dialog.types.ts";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { getMemberById } from "infrastructure/redux/member/member.selectors.ts";
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

interface MemberFormProps {
  payload: DialogPayload | null;
}

export default function MemberForm({ payload }: MemberFormProps) {
  const dispatch = useDispatch();
  const { openDialog } = useDialogContext();
  const organizations = useSelector(getOrganizations);
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
      ? existingMember.status.lastActiveDate
      : new Date().toISOString().slice(0, 10),
  );

  if (!coordinates) {
    return <p>No location selected. Close this and click the map to place a new member.</p>;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    let member: Member = existingMember ? { ...existingMember } : createMember(firstName, lastName);
    member = { ...member, name: { firstName, lastName } };

    const address: MemberAddress = { street, number, zip: Number(zip), city, coordinates };
    member = updateMemberAddress(member, address);
    member = updateMemberTelephone(member, telephone);
    member = updateMemberEmail(member, email);
    member = organizationId ? assignOrganization(member, organizationId) : member;
    member = lostContact ? markLostContact(member, lastActiveDate) : reactivateMember(member);

    dispatch(isEditMode ? updateMember(member) : addMember(member));
    openDialog(null);
  };

  const handleRemove = () => {
    if (existingMember) {
      dispatch(removeMember(existingMember.id));
    }
    openDialog(null);
  };

  return (
    <form onSubmit={handleSubmit} className="standard-dialog">
      <h2>{isEditMode ? "Edit Member" : "Add Member"}</h2>

      <label htmlFor="member-first-name">First name</label>
      <br />
      <input
        id="member-first-name"
        type="text"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
        required
      />
      <br />
      <label htmlFor="member-last-name">Last name</label>
      <br />
      <input
        id="member-last-name"
        type="text"
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
        required
      />
      <br />

      <label htmlFor="member-street">Street</label>
      <br />
      <input
        id="member-street"
        type="text"
        value={street}
        onChange={(event) => setStreet(event.target.value)}
      />
      &nbsp;
      <label htmlFor="member-number">No.</label>
      <input
        id="member-number"
        type="text"
        value={number}
        onChange={(event) => setNumber(event.target.value)}
      />
      <br />
      <label htmlFor="member-zip">ZIP</label>
      <br />
      <input
        id="member-zip"
        type="text"
        value={zip}
        onChange={(event) => setZip(event.target.value)}
      />
      &nbsp;
      <label htmlFor="member-city">City</label>
      <input
        id="member-city"
        type="text"
        value={city}
        onChange={(event) => setCity(event.target.value)}
      />
      <br />

      <label htmlFor="member-telephone">Telephone</label>
      <br />
      <input
        id="member-telephone"
        type="tel"
        value={telephone}
        onChange={(event) => setTelephone(event.target.value)}
      />
      <br />
      <label htmlFor="member-email">Email</label>
      <br />
      <input
        id="member-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <br />

      <label htmlFor="member-organization">Organization</label>
      <br />
      <select
        id="member-organization"
        value={organizationId}
        onChange={(event) => setOrganizationId(event.target.value)}
      >
        <option value="">— Unassigned —</option>
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name} ({organization.type})
          </option>
        ))}
      </select>
      <br />

      <input
        id="member-lost-contact"
        type="checkbox"
        checked={lostContact}
        onChange={(event) => setLostContact(event.target.checked)}
      />
      <label htmlFor="member-lost-contact">Lost contact</label>
      {lostContact && (
        <>
          <br />
          <label htmlFor="member-last-active-date">Last known active</label>
          <br />
          <input
            id="member-last-active-date"
            type="date"
            value={lastActiveDate}
            onChange={(event) => setLastActiveDate(event.target.value)}
          />
        </>
      )}
      <br />

      <button type="submit" className="btn">
        Save
      </button>
      &nbsp;
      <button type="button" className="btn" onClick={() => openDialog(null)}>
        Cancel
      </button>
      {isEditMode && (
        <>
          &nbsp;
          <button type="button" className="btn" onClick={handleRemove}>
            Remove
          </button>
        </>
      )}
    </form>
  );
}
