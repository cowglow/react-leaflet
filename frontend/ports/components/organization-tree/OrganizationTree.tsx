import { KeyboardEvent, MouseEvent, useState } from "react";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { bringToFront, closeWindow, openWindow } from "infrastructure/redux/windows/windows.slice.ts";
import {
  clearSelection,
  selectMembers,
  toggleMember,
} from "infrastructure/redux/selection/selection.slice.ts";
import {
  getSelectedMemberIds,
  getSelectedMembers,
} from "infrastructure/redux/selection/selection.selectors.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { getOrganizations } from "infrastructure/redux/organization/organization.selectors.ts";
import { getMembers } from "infrastructure/redux/member/member.selectors.ts";
import DesktopWindow from "ports/components/windows/DesktopWindow.tsx";
import type { Member } from "domain/member/member.types.ts";
import type { OrganizationType } from "domain/shared/types.ts";
import type { Translations } from "ports/i18n/translations/index.ts";
import "./organization-tree.css";

const ORGANIZATION_TYPE_ORDER: OrganizationType[] = ["Region", "Headquarter", "Area", "District"];

// A sentinel key alongside real organization ids in the `openOrgs` expand/collapse
// set — safe since organization ids are UUIDs, never this literal string.
const UNASSIGNED_KEY = "__unassigned__";

function isMulti(event: MouseEvent | KeyboardEvent) {
  return event.shiftKey || event.metaKey || event.ctrlKey;
}

function displayName(member: Member, t: Translations) {
  return `${member.name.firstName} ${member.name.lastName}`.trim() || t.member.untitled;
}

function MemberRow({
  member,
  selected,
  onSelect,
  t,
}: {
  member: Member;
  selected: boolean;
  onSelect: (event: MouseEvent | KeyboardEvent) => void;
  t: Translations;
}) {
  return (
    <li
      className={`org-tree-member${selected ? " is-selected" : ""}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(event);
        }
      }}
    >
      {displayName(member, t)}
    </li>
  );
}

function MemberPreview({
  member,
  organizationName,
  t,
  onEdit,
}: {
  member: Member;
  organizationName?: string;
  t: Translations;
  onEdit: () => void;
}) {
  const status =
    member.status.kind === "lost-contact"
      ? t.memberMarker.lostContactSince(member.status.lastActiveDate.slice(0, 10))
      : t.memberMarker.active;

  return (
    <div className="org-preview-card">
      <h2 className="org-preview-name">{displayName(member, t)}</h2>
      <dl className="org-preview-fields">
        <dt>{t.memberForm.organization}</dt>
        <dd>{organizationName ?? t.memberForm.unassigned}</dd>
        <dt>{t.memberForm.telephone}</dt>
        <dd>{member.contact?.telephone || t.organizationTree.noPhone}</dd>
        <dt>{t.memberForm.email}</dt>
        <dd>{member.contact?.email || t.organizationTree.noEmail}</dd>
        {member.address && (
          <>
            <dt>{t.organizationTree.coordinates}</dt>
            <dd>
              {member.address.coordinates.lat.toFixed(4)}, {member.address.coordinates.lng.toFixed(4)}
            </dd>
          </>
        )}
      </dl>
      <p className="org-preview-status">
        {t.memberMarker.statusLabel}: {status}
      </p>
      <div className="org-preview-actions">
        <button className="btn btn-default" onClick={onEdit}>
          {t.common.edit}
        </button>
      </div>
    </div>
  );
}

export default function OrganizationTree({ z }: { z?: number }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const organizations = useSelector(getOrganizations);
  const members = useSelector(getMembers);
  const selectedIds = useSelector(getSelectedMemberIds);
  const selectedMembers = useSelector(getSelectedMembers);
  const [openOrgs, setOpenOrgs] = useState<Set<string>>(new Set());

  const selectedSet = new Set(selectedIds);
  const hasSelection = selectedIds.length > 0;
  const hasOrganizations = organizations.length > 0;

  const membersOf = (organizationId: string) =>
    members.filter((member) => member.organizationId === organizationId);
  const unassignedMembers = members.filter((member) => !member.organizationId);

  const selectMember = (id: string, event: MouseEvent | KeyboardEvent) =>
    dispatch(isMulti(event) ? toggleMember(id) : selectMembers([id]));

  const selectGroup = (groupKey: string, groupMembers: Member[]) => {
    dispatch(selectMembers(groupMembers.map((member) => member.id)));
    setOpenOrgs((prev) => new Set(prev).add(groupKey));
  };

  const groupState = (groupMembers: Member[]): "none" | "some" | "all" => {
    const ids = groupMembers.map((member) => member.id);
    if (ids.length === 0) return "none";
    const selectedCount = ids.filter((id) => selectedSet.has(id)).length;
    if (selectedCount === 0) return "none";
    return selectedCount === ids.length ? "all" : "some";
  };

  const organizationNameFor = (member: Member) =>
    organizations.find((organization) => organization.id === member.organizationId)?.name;

  return (
    <DesktopWindow
      title={t.organizationTree.title}
      onClose={() => dispatch(closeWindow("ORGANIZATION_TREE_DIALOG"))}
      onFocus={() => dispatch(bringToFront("ORGANIZATION_TREE_DIALOG"))}
      initialPosition={{ x: 96, y: 96 }}
      width={hasSelection ? "min(810px, 94vw)" : "min(460px, 92vw)"}
      height="auto"
      z={z}
      padded
    >
      <div className="org-tree-layout">
        <div className="org-tree-main">
          {!hasOrganizations && unassignedMembers.length === 0 && <p>{t.organizationTree.empty}</p>}
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
                        const organizationMembers = membersOf(organization.id);
                        const state = groupState(organizationMembers);

                        return (
                          <li key={organization.id}>
                            <details
                              open={openOrgs.has(organization.id)}
                              onToggle={(event) => {
                                // Read synchronously — currentTarget is nulled
                                // by the time a deferred state updater runs.
                                const nowOpen = event.currentTarget.open;
                                setOpenOrgs((prev) => {
                                  if (prev.has(organization.id) === nowOpen) return prev;
                                  const next = new Set(prev);
                                  if (nowOpen) next.add(organization.id);
                                  else next.delete(organization.id);
                                  return next;
                                });
                              }}
                            >
                              {/* Single click just expands/collapses, like any
                                  tree node. Double click selects all the org's
                                  members (and leaves it expanded). */}
                              <summary
                                title={t.organizationTree.selectHint}
                                onDoubleClick={() => selectGroup(organization.id, organizationMembers)}
                              >
                                <span className={`org-name org-name--${state}`}>
                                  {organization.name}
                                </span>
                              </summary>
                              {organizationMembers.length > 0 ? (
                                <ul>
                                  {organizationMembers.map((member) => (
                                    <MemberRow
                                      key={member.id}
                                      member={member}
                                      selected={selectedSet.has(member.id)}
                                      onSelect={(event) => selectMember(member.id, event)}
                                      t={t}
                                    />
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
            {unassignedMembers.length > 0 && (
              <li>
                <details
                  open={openOrgs.has(UNASSIGNED_KEY)}
                  onToggle={(event) => {
                    const nowOpen = event.currentTarget.open;
                    setOpenOrgs((prev) => {
                      if (prev.has(UNASSIGNED_KEY) === nowOpen) return prev;
                      const next = new Set(prev);
                      if (nowOpen) next.add(UNASSIGNED_KEY);
                      else next.delete(UNASSIGNED_KEY);
                      return next;
                    });
                  }}
                >
                  <summary
                    title={t.organizationTree.selectHint}
                    onDoubleClick={() => selectGroup(UNASSIGNED_KEY, unassignedMembers)}
                  >
                    <span className={`org-name org-name--${groupState(unassignedMembers)}`}>
                      {t.organizationTree.unassigned}
                    </span>
                  </summary>
                  <ul>
                    {unassignedMembers.map((member) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        selected={selectedSet.has(member.id)}
                        onSelect={(event) => selectMember(member.id, event)}
                        t={t}
                      />
                    ))}
                  </ul>
                </details>
              </li>
            )}
          </ul>
          {hasSelection && (
            <div className="org-tree-toolbar">
              <button className="btn" onClick={() => dispatch(clearSelection())}>
                {t.organizationTree.clear}
              </button>
            </div>
          )}
        </div>

        {hasSelection && (
          <aside className="org-preview">
            {selectedMembers.length === 1 ? (
              <MemberPreview
                member={selectedMembers[0]}
                organizationName={organizationNameFor(selectedMembers[0])}
                t={t}
                onEdit={() =>
                  dispatch(
                    openWindow({
                      type: "MEMBER_DIALOG",
                      payload: { memberId: selectedMembers[0].id },
                    }),
                  )
                }
              />
            ) : (
              <>
                <strong>{t.organizationTree.selectedCount(selectedMembers.length)}</strong>
                <ul className="org-preview-list">
                  {selectedMembers.map((member) => (
                    <li key={member.id}>{displayName(member, t)}</li>
                  ))}
                </ul>
              </>
            )}
          </aside>
        )}
      </div>
    </DesktopWindow>
  );
}
