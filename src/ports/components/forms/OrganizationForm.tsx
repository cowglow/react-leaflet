import { FormEvent, useState } from "react";
import { useDispatch } from "infrastructure/redux/hooks.ts";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { addOrganization } from "infrastructure/redux/organization/organization.slice.ts";
import { createOrganization } from "domain/organization/organization.factory.ts";
import type { OrganizationType } from "domain/shared/types.ts";

const organizationTypes: OrganizationType[] = ["Region", "Headquarter", "Area", "District"];

export default function OrganizationForm() {
  const dispatch = useDispatch();
  const { openDialog } = useDialogContext();
  const [name, setName] = useState("");
  const [type, setType] = useState<OrganizationType>("District");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(addOrganization(createOrganization(name, type)));
    openDialog(null);
  };

  return (
    <form onSubmit={handleSubmit} className="standard-dialog">
      <h2>Add Organization</h2>

      <label htmlFor="org-name">Name</label>
      <br />
      <input
        id="org-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <br />

      <label htmlFor="org-type">Type</label>
      <br />
      <select
        id="org-type"
        value={type}
        onChange={(event) => setType(event.target.value as OrganizationType)}
      >
        {organizationTypes.map((organizationType) => (
          <option key={organizationType} value={organizationType}>
            {organizationType}
          </option>
        ))}
      </select>
      <br />

      <button type="submit" className="btn">
        Save
      </button>
      &nbsp;
      <button type="button" className="btn" onClick={() => openDialog(null)}>
        Cancel
      </button>
    </form>
  );
}
