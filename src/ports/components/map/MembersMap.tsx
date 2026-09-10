import L from "leaflet";
import Map from "ports/components/map/Map.tsx";
import MapBounds from "ports/components/layer-groups/MapBounds.ts";
import MapEvents from "ports/components/map/Map.Events.tsx";
import MemberMarker from "ports/components/markers/Marker.Member.tsx";
import MarkerOwnPosition from "ports/components/markers/Marker.OwnPosition.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { getFilteredMembers } from "infrastructure/redux/member/member.selectors.ts";
import { isLeader } from "infrastructure/redux/auth/auth.selectors.ts";
import { openWindow } from "infrastructure/redux/windows/windows.slice.ts";

const NBG_CENTER = new L.LatLng(49.4521, 11.0767);

export default function MembersMap() {
  const dispatch = useDispatch();
  const members = useSelector(getFilteredMembers);
  const canWrite = useSelector(isLeader);

  return (
    <Map center={NBG_CENTER} zoom={8} scrollWheelZoom={true} bounceAtZoomLimits={true}>
      <MarkerOwnPosition />
      <MapBounds disableZoom={false} />
      {members
        .filter((member) => Boolean(member.address))
        .map((member) => (
          <MemberMarker key={member.id} member={member} />
        ))}
      <MapEvents
        onClick={({ latlng: { lat, lng } }) => {
          if (canWrite) {
            dispatch(openWindow({ type: "MEMBER_DIALOG", payload: { coordinates: { lat, lng } } }));
          }
        }}
      />
    </Map>
  );
}
