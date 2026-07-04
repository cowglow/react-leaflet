import L from "leaflet";
import MainLayout from "ports/components/layout/MainLayout.tsx";
import Map from "ports/components/map/Map.tsx";
import MapBounds from "ports/components/layer-groups/MapBounds.ts";
import MapControls from "ports/components/controls/MapControls.tsx";
import MarkerDefault from "ports/components/markers/Marker.Default.tsx";
import { useDispatch, useSelector } from "infrastructure/redux/hooks.ts";
import {
  getFilteredMarkers,
  isLoading,
} from "infrastructure/redux/marker/marker.selectors.ts";
import MapEvents from "ports/components/map/Map.Events.tsx";
import { addMarker } from "infrastructure/redux/marker/marker.slice.ts";
import Loader from "ports/components/ui/Loader.tsx";
import MarkerOwnPosition from "ports/components/markers/Marker.OwnPosition.tsx";
import type { GeoCoordinate } from "domain/marker/geo-coordinate.ts";

export default function App() {
  const dispatch = useDispatch();
  const markers = useSelector(getFilteredMarkers);
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
        {[...markers].map((marker: GeoCoordinate, index) => (
          <div key={index}>
            <MarkerDefault position={marker} />
          </div>
        ))}
        <MapEvents
          onClick={({ latlng: { lat, lng } }) => {
            dispatch(addMarker({ lat, lng }));
          }}
        />
      </Map>
    </MainLayout>
  );
}