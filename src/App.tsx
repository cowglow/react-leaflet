import L from "leaflet";
import MainLayout from "ports/components/layout/MainLayout.tsx";
import Map from "ports/components/map/Map.tsx";
import MapBounds from "ports/components/layer-groups/MapBounds.ts";
import MapControls from "ports/components/controls/MapControls.tsx";
import MemberMarker from "ports/components/markers/Marker.Member.tsx";
import { useSelector } from "infrastructure/redux/hooks.ts";
import { getFilteredMembers } from "infrastructure/redux/member/member.selectors.ts";
import MapEvents from "ports/components/map/Map.Events.tsx";
import { useDialogContext } from "ports/context/app-dialog/app-dialog.hook.ts";
import MarkerOwnPosition from "ports/components/markers/Marker.OwnPosition.tsx";

export default function App() {
  const members = useSelector(getFilteredMembers);
  const { openDialog } = useDialogContext();

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
            openDialog("MEMBER_DIALOG", { coordinates: { lat, lng } });
          }}
        />
      </Map>
    </MainLayout>
  );
}
