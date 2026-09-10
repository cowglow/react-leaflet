import MapMarker from "ports/components/map/Map.Marker.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { openWindow } from "infrastructure/redux/windows/windows.slice.ts";
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
  const dispatch = useDispatch();
  const { t } = useTranslation();

  if (!member.address) {
    return null;
  }

  const { street, number, zip, city, coordinates } = member.address;
  const fullName = `${member.name.firstName} ${member.name.lastName}`;

  return (
    <MapMarker longitude={coordinates.lng} latitude={coordinates.lat}>
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
          <button
            className="btn"
            onClick={() =>
              dispatch(openWindow({ type: "MEMBER_DIALOG", payload: { memberId: member.id } }))
            }
          >
            {t.common.edit}
          </button>
        </>
      )}
    </MapMarker>
  );
}
