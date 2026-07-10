import { useSelector } from "infrastructure/redux/hooks.ts";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { getOrganizations } from "infrastructure/redux/organization/organization.selectors.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import DialogWindow from "ports/components/dialogs/DialogWindow.tsx";
import type { OrganizationType } from "domain/shared/types.ts";
import "./organization-tree.css";

const ORGANIZATION_TYPE_ORDER: OrganizationType[] = ["Region", "Headquarter", "Area", "District"];

export default function OrganizationTree() {
  const { openDialog } = useDialogContext();
  const { t } = useTranslation();
  const organizations = useSelector(getOrganizations);
  const members = useSelector(getMembers);

  const hasOrganizations = organizations.length > 0;

  return (
    <DialogWindow title={t.organizationTree.title} onClose={() => openDialog(null)}>
      {!hasOrganizations && <p>{t.organizationTree.empty}</p>}
      <ul className="org-tree">
        {ORGANIZATION_TYPE_ORDER.map((type) => {
          const organizationsOfType = organizations.filter(
            (organization) => organization.type === type,
          );
          if (organizationsOfType.length === 0) {
            return null;
          }

          return (
            <li key={type}>
              <details open>
                <summary>{t.organizationTypes[type]}</summary>
                <ul>
                  {organizationsOfType.map((organization) => {
                    const organizationMembers = members.filter(
                      (member) => member.organizationId === organization.id,
                    );

                    return (
                      <li key={organization.id}>
                        <details>
                          <summary>{organization.name}</summary>
                          {organizationMembers.length > 0 ? (
                            <ul>
                              {organizationMembers.map((member) => (
                                <li key={member.id}>
                                  {member.name.firstName} {member.name.lastName}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="org-tree-empty">{t.organizationTree.noMembers}</p>
                          )}
                        </details>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </DialogWindow>
  );
}
