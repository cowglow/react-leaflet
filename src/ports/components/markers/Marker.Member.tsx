import MapMarker from "ports/components/map/Map.Marker.tsx";
import { Popup } from "react-leaflet";
import L from "leaflet";
import { useDispatch } from "infrastructure/redux/hooks.ts";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import { removeMember } from "infrastructure/redux/member/member.slice.ts";
import type { Member } from "domain/member/member.types.ts";

interface MemberMarkerProps {
  member: Member;
}

export default function MemberMarker({ member }: MemberMarkerProps) {
  const dispatch = useDispatch();
  const { openDialog } = useDialogContext();

  if (!member.address) {
    return null;
  }

  const { street, number, zip, city, coordinates } = member.address;
  const latLng = new L.LatLng(coordinates.lat, coordinates.lng);

  return (
    <MapMarker position={latLng} events={{}}>
      <Popup>
        <strong>
          {member.name.firstName} {member.name.lastName}
        </strong>
        <br />
        {street} {number}, {zip} {city}
        <br />
        {member.status.kind === "lost-contact"
          ? `Lost contact since ${member.status.lastActiveDate}`
          : "Active"}
        <br />
        <button
          className="btn"
          onClick={() => openDialog("MEMBER_DIALOG", { memberId: member.id })}
        >
          Edit
        </button>
        &nbsp;
        <button className="btn" onClick={() => dispatch(removeMember(member.id))}>
          Remove
        </button>
      </Popup>
    </MapMarker>
  );
}
