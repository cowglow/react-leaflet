import L from "leaflet";
import MainLayout from "components/layout/MainLayout.tsx";
import Map from "feature/map/Map.tsx";
import MapBounds from "components/layer-groups/MapBounds.ts";
import MapControls from "components/map-controls/MapControls.tsx";
import MarkerDefault from "components/markers/Marker.Default.tsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getFilteredMarkers,
  isEnabled,
  isLoading,
} from "redux-store/store/marker/marker-selectors.ts";
import MapEvents from "feature/map/Map.Events.tsx";
import { addMarker } from "redux-store/store/marker/marker-slice.ts";
import Loader from "./ui/Loader.tsx";
import MarkerOwnPosition from "./markers/Marker.OwnPosition.tsx";

export default function App() {
  const dispatch = useDispatch();
  const markers = useSelector(getFilteredMarkers);

  const isMarkersEnabled = useSelector(isEnabled);
  const isMarkersLoading = useSelector(isLoading);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  return (
    <MainLayout>
      <Loader open={isMarkersLoading} />
      <Map
        center={nbgCenter}
        zoom={8}
        scrollWheelZoom={true}
        bounceAtZoomLimits={true}
      >
        <MarkerOwnPosition />
        <MapControls />
        <MapBounds disableZoom={false} />
        {[...markers].map((marker: L.LatLng, index) => (
          <div key={index}>
            <MarkerDefault position={marker} />
          </div>
        ))}
        <MapEvents
          enabled={isMarkersEnabled}
          onClick={({ latlng: { lat, lng } }) => {
            dispatch(addMarker(new L.LatLng(lat, lng)));
          }}
        />
      </Map>
    </MainLayout>
  );
}
