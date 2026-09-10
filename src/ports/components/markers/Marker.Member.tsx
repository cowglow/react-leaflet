import MapMarker from "ports/components/map/Map.Marker.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { openWindow } from "infrastructure/redux/windows/windows.slice.ts";
import { updateMember } from "infrastructure/redux/member/member.slice.ts";
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

  if (!member.address) {
    return null;
  }

  const { street, number, zip, city, coordinates } = member.address;
  const fullName = `${member.name.firstName} ${member.name.lastName}`;

  const openForm = () =>
    dispatch(openWindow({ type: "MEMBER_DIALOG", payload: { memberId: member.id } }));

  const handleSelect = (multi: boolean) =>
    dispatch(multi ? toggleMember(member.id) : selectMembers([member.id]));

  const handleMoveEnd = async ({ lat, lng }: { lat: number; lng: number }) => {
    try {
      await dispatch(
        updateMember({ ...member, address: { ...member.address!, coordinates: { lat, lng } } }),
      ).unwrap();
    } catch (error) {
      alert(error instanceof Error ? error.message : t.memberForm.saveFailed);
    }
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
    >
      <strong>{fullName}</strong>
      <br />
      {street} {number}, {zip} {city}
      <br />
      {member.status.kind === "lost-contact"
        ? t.memberMarker.lostContactSince(member.status.lastActiveDate.slice(0, 10))
        : t.memberMarker.active}
      {canWrite && (
        <>
          <br />
          <button className="btn" onClick={openForm}>
            {t.common.edit}
          </button>
        </>
      )}
    </MapMarker>
  );
}
