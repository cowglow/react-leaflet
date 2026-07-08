import MapMarker from "ports/components/map/Map.Marker.tsx";
import { Popup } from "react-leaflet";
import L from "leaflet";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { removeMember } from "infrastructure/redux/member/member.slice.ts";
import { isLeader } from "infrastructure/redux/auth/auth.selectors.ts";
import type { Member } from "domain/member/member.types.ts";

interface MemberMarkerProps {
  member: Member;
}

export default function MemberMarker({ member }: MemberMarkerProps) {
  const dispatch = useDispatch();
  const canWrite = useSelector(isLeader);
  const { openDialog } = useDialogContext();

  const handleRemove = async () => {
    try {
      await dispatch(removeMember(member.id)).unwrap();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to remove member");
    }
  };

  if (!member.address) {
    return null;
  }

  const { street, number, zip, city, coordinates } = member.address;
  const latLng = new L.LatLng(coordinates.lat, coordinates.lng);

  return (
    <MapMarker
      position={latLng}
      events={{}}
      alt={`${member.name.firstName} ${member.name.lastName}`}
    >
      <Popup>
        <strong>
          {member.name.firstName} {member.name.lastName}
        </strong>
        <br />
        {street} {number}, {zip} {city}
        <br />
        {member.status.kind === "lost-contact"
          ? `Lost contact since ${member.status.lastActiveDate.slice(0, 10)}`
          : "Active"}
        {canWrite && (
          <>
            <br />
            <button
              className="btn"
              onClick={() => openDialog("MEMBER_DIALOG", { memberId: member.id })}
            >
              Edit
            </button>
            &nbsp;
            <button className="btn" onClick={handleRemove}>
              Remove
            </button>
          </>
        )}
      </Popup>
    </MapMarker>
  );
}
