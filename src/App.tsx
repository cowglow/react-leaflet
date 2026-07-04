import L from "leaflet";
import { useEffect } from "react";
import MainLayout from "ports/components/layout/MainLayout.tsx";
import Map from "ports/components/map/Map.tsx";
import MapBounds from "ports/components/layer-groups/MapBounds.ts";
import MapControls from "ports/components/controls/MapControls.tsx";
import MemberMarker from "ports/components/markers/Marker.Member.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import { fetchMembers } from "infrastructure/redux/member/member.slice.ts";
import { getFilteredMembers } from "infrastructure/redux/member/member.selectors.ts";
import { fetchOrganizations } from "infrastructure/redux/organization/organization.slice.ts";
import MapEvents from "ports/components/map/Map.Events.tsx";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import MarkerOwnPosition from "ports/components/markers/Marker.OwnPosition.tsx";
import { isLeader } from "infrastructure/redux/auth/auth.selectors.ts";

export default function App() {
  const dispatch = useDispatch();
  const members = useSelector(getFilteredMembers);
  const canWrite = useSelector(isLeader);
  const { openDialog } = useDialogContext();

  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  return (
    <MainLayout>
      <Map
        center={nbgCenter}
        zoom={8}
        scrollWheelZoom={true}
        bounceAtZoomLimits={true}
      >
        <MarkerOwnPosition />
        <MapControls />
        <MapBounds disableZoom={false} />
        {members
          .filter((member) => Boolean(member.address))
          .map((member) => (
            <MemberMarker key={member.id} member={member} />
          ))}
        <MapEvents
          onClick={({ latlng: { lat, lng } }) => {
            if (canWrite) {
              openDialog("MEMBER_DIALOG", { coordinates: { lat, lng } });
            }
          }}
        />
      </Map>
    </MainLayout>
  );
}
