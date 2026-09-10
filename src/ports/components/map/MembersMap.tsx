import Map from "ports/components/map/Map.tsx";
import MapBounds from "ports/components/layer-groups/MapBounds.ts";
import MemberMarker from "ports/components/markers/Marker.Member.tsx";
import MarkerOwnPosition from "ports/components/markers/Marker.OwnPosition.tsx";
import SelectionCamera from "ports/components/map/SelectionCamera.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getFilteredMembers } from "infrastructure/redux/member/member.selectors.ts";
import { isLeader } from "infrastructure/redux/auth/auth.selectors.ts";
import { addMember } from "infrastructure/redux/member/member.slice.ts";
import { clearSelection } from "infrastructure/redux/selection/selection.slice.ts";
import { openWindow } from "infrastructure/redux/windows/windows.slice.ts";
import { createIncompleteMember } from "domain/member/member.factory.ts";

const NBG_CENTER = { longitude: 11.0767, latitude: 49.4521 };

export default function MembersMap() {
  const dispatch = useDispatch();
  const members = useSelector(getFilteredMembers);
  const canWrite = useSelector(isLeader);

  return (
    <Map
      center={NBG_CENTER}
      zoom={8}
      scrollZoom
      onMapClick={({ lat, lng }, { shift }) => {
        if (shift) {
          // Quick pin — drop a placeholder member, fill in details later.
          if (canWrite) dispatch(addMember(createIncompleteMember({ lat, lng })));
          return;
        }
        // A plain click on empty map clears the selection...
        dispatch(clearSelection());
        // ...and, for leaders, starts a new member here.
        if (canWrite) {
          dispatch(openWindow({ type: "MEMBER_DIALOG", payload: { coordinates: { lat, lng } } }));
        }
      }}
    >
      <MarkerOwnPosition />
      <MapBounds disableZoom={false} />
      <SelectionCamera />
      {members
        .filter((member) => Boolean(member.address))
        .map((member) => (
          <MemberMarker key={member.id} member={member} />
        ))}
    </Map>
  );
}
