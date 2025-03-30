import L from "leaflet";
import MainLayout from "components/layout/MainLayout.tsx";
import Map from "feature/map/Map.tsx";
import MapBounds from "components/layer-groups/MapBounds.ts";
import MapControls from "components/map-controls/MapControls.tsx";
import { Marker } from "react-leaflet";
import MarkerDefault from "components/markers/Marker.Default.tsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getMarkers,
  isEnabled,
} from "context/redux-store/store/marker/marker-selectors.ts";
import MapEvents from "feature/map/Map.Events.tsx";
import { addMarker } from "context/redux-store/store/marker/marker-slice.ts";

export default function App() {
  const dispatch = useDispatch();
  const markers = useSelector(getMarkers);
  const isMarkersEnabled = useSelector(isEnabled);

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  // noinspection TypeScriptValidateTypes
  return (
    <MainLayout>
      <Map
        center={nbgCenter}
        zoom={8}
        scrollWheelZoom={true}
        bounceAtZoomLimits
      >
        <Marker position={nbgCenter} />
        <MapControls />
        <MapBounds disableZoom={false} />
        {[...markers].map((marker: L.LatLng, index) => (
          <MarkerDefault key={index} position={marker} />
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
