import { useEffect, useRef } from "react";
import MapMarker from "ports/components/map/Map.Marker.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { openWindow } from "infrastructure/redux/windows/windows.slice.ts";
import { resetMemberMutation, updateMemberRequested } from "infrastructure/redux/member/member.slice.ts";
import {
  getMemberMutationError,
  getMemberMutationRequestId,
  getMemberMutationStatus,
} from "infrastructure/redux/member/member.selectors.ts";
import { createRequestId } from "infrastructure/redux/request-id.ts";
import { selectMembers, toggleMember } from "infrastructure/redux/selection/selection.slice.ts";
import {
  getSelectionCount,
  isMemberSelected,
} from "infrastructure/redux/selection/selection.selectors.ts";
import { useTranslation } from "ports/context/i18n/i18n.hook.ts";
import { getMemberId, isLeader } from "infrastructure/redux/auth/auth.selectors.ts";
import type { Member } from "domain/member/member.types.ts";

interface MemberMarkerProps {
  member: Member;
}

export default function MemberMarker({ member }: MemberMarkerProps) {
  const leader = useSelector(isLeader);
  const ownMemberId = useSelector(getMemberId);
  const canWrite = leader || ownMemberId === member.id;
  const selected = useSelector((state) => isMemberSelected(state, member.id));
  const selectionCount = useSelector(getSelectionCount);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Auto-open the popup only when this marker is the sole selection.
  const autoOpen = selected && selectionCount === 1;

  // Correlates a drag-move this marker issued with the outcome the saga reports
  // back, so this effect never reacts to some other member's mutation (the form,
  // or another marker being moved).
  const pendingMoveRequestId = useRef<string | null>(null);
  const mutationStatus = useSelector(getMemberMutationStatus);
  const mutationRequestId = useSelector(getMemberMutationRequestId);
  const mutationError = useSelector(getMemberMutationError);

  useEffect(() => {
    if (!pendingMoveRequestId.current || mutationRequestId !== pendingMoveRequestId.current) {
      return;
    }
    if (mutationStatus === "succeeded") {
      pendingMoveRequestId.current = null;
      dispatch(resetMemberMutation());
    } else if (mutationStatus === "failed") {
      pendingMoveRequestId.current = null;
      alert(mutationError ?? t.memberForm.saveFailed);
      dispatch(resetMemberMutation());
    }
  }, [mutationStatus, mutationRequestId, mutationError, dispatch, t]);

  if (!member.address) {
    return null;
  }

  const { street, number, zip, city, coordinates } = member.address;
  const fullName = `${member.name.firstName} ${member.name.lastName}`;

  const openForm = () =>
    dispatch(openWindow({ type: "MEMBER_DIALOG", payload: { memberId: member.id } }));

  const handleSelect = (multi: boolean) =>
    dispatch(multi ? toggleMember(member.id) : selectMembers([member.id]));

  const handleMoveEnd = ({ lat, lng }: { lat: number; lng: number }) => {
    const requestId = createRequestId();
    pendingMoveRequestId.current = requestId;
    dispatch(
      updateMemberRequested({
        requestId,
        member: { ...member, address: { ...member.address!, coordinates: { lat, lng } } },
      }),
    );
  };

  // Incomplete pin (Shift+click placeholder): amber, smaller, and clicking it
  // jumps straight to the form to fill in the details.
  if (member.incomplete) {
    return (
      <MapMarker
        longitude={coordinates.lng}
        latitude={coordinates.lat}
        color="#d98a00"
        scale={0.85}
        selected={selected}
        onSelect={handleSelect}
        onActivate={canWrite ? openForm : undefined}
      />
    );
  }

  return (
    <MapMarker
      longitude={coordinates.lng}
      latitude={coordinates.lat}
      selected={selected}
      onSelect={handleSelect}
      autoOpen={autoOpen}
      onMoveEnd={canWrite ? handleMoveEnd : undefined}
      actions={
        canWrite && (
          <button className="btn" onClick={openForm}>
            {t.common.edit}
          </button>
        )
      }
    >
      <strong>{fullName}</strong>
      <br />
      {street} {number}, {zip} {city}
      <br />
      {t.memberMarker.statusLabel}:{" "}
      {member.status.kind === "lost-contact"
        ? t.memberMarker.lostContactSince(member.status.lastActiveDate.slice(0, 10))
        : t.memberMarker.active}
    </MapMarker>
  );
}
