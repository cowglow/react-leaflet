import { FormEvent, useState } from "react";
import { useDispatch } from "infrastructure/redux/hooks.ts";
import { bringToFront, closeWindow } from "infrastructure/redux/windows/windows.slice.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { addOrganization } from "infrastructure/redux/organization/organization.slice.ts";
import { createOrganization } from "domain/organization/organization.factory.ts";
import type { OrganizationType } from "domain/shared/types.ts";
import DesktopWindow from "ports/components/windows/DesktopWindow.tsx";
import "./forms.css";

const organizationTypes: OrganizationType[] = [
  "Region",
  "Headquarter",
  "Area",
  "District",
];

export default function OrganizationForm({ z }: { z?: number }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [type, setType] = useState<OrganizationType>("District");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await dispatch(addOrganization(createOrganization(name, type))).unwrap();
      dispatch(closeWindow("ORGANIZATION_DIALOG"));
    } catch (error) {
      alert(
        error instanceof Error ? error.message : t.organizationForm.saveFailed,
      );
    }
  };

  return (
    <DesktopWindow
      title={t.organizationForm.title}
      onClose={() => dispatch(closeWindow("ORGANIZATION_DIALOG"))}
      onFocus={() => dispatch(bringToFront("ORGANIZATION_DIALOG"))}
      initialPosition={{ x: 160, y: 140 }}
      width="min(400px, 92vw)"
      height="auto"
      z={z}
      padded
    >
      <form onSubmit={handleSubmit}>
        <div className="field-stack">
          <label htmlFor="org-name">{t.organizationForm.name}</label>
          <input
            id="org-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="field-stack">
          <label htmlFor="org-type">{t.organizationForm.type}</label>
          <select
            id="org-type"
            value={type}
            onChange={(event) =>
              setType(event.target.value as OrganizationType)
            }
          >
            {organizationTypes.map((organizationType) => (
              <option key={organizationType} value={organizationType}>
                {t.organizationTypes[organizationType]}
              </option>
            ))}
          </select>
        </div>

        <div
          className="field-row field-stack"
          style={{ justifyContent: "flex-end" }}
        >
          <button
            type="button"
            className="btn"
            onClick={() => dispatch(closeWindow("ORGANIZATION_DIALOG"))}
          >
            {t.common.cancel}
          </button>
          <button type="submit" className="btn btn-default">
            {t.common.save}
          </button>
        </div>
      </form>
    </DesktopWindow>
  );
}
