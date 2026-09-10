import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { bringToFront, closeWindow } from "infrastructure/redux/windows/windows.slice.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { getOrganizations } from "infrastructure/redux/organization/organization.selectors.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import DesktopWindow from "ports/components/windows/DesktopWindow.tsx";
import type { OrganizationType } from "domain/shared/types.ts";
import "./organization-tree.css";

const ORGANIZATION_TYPE_ORDER: OrganizationType[] = ["Region", "Headquarter", "Area", "District"];

export default function OrganizationTree({ z }: { z?: number }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const organizations = useSelector(getOrganizations);
  const members = useSelector(getMembers);

  const hasOrganizations = organizations.length > 0;

  return (
    <DesktopWindow
      title={t.organizationTree.title}
      onClose={() => dispatch(closeWindow("ORGANIZATION_TREE_DIALOG"))}
      onFocus={() => dispatch(bringToFront("ORGANIZATION_TREE_DIALOG"))}
      initialPosition={{ x: 96, y: 96 }}
      width="min(460px, 92vw)"
      height="auto"
      z={z}
      padded
    >
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
                                  {`${member.name.firstName} ${member.name.lastName}`.trim() ||
                                    t.member.untitled}
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
    </DesktopWindow>
  );
}
