import L from "leaflet";
import MainLayout from "components/layout/MainLayout.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import Map from "feature/map/Map.tsx";
import LayerGroupMarker from "components/layer-groups/LayerGroup.Markers.tsx";
import MapBounds from "components/layer-groups/MapBounds.ts";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "context/state/store.ts";
// import {
//   decrement,
//   increment,
//   incrementAsync,
//   incrementByAmount,
// } from "context/state/counter/counterSlice.ts";
import MapControls from "components/map-controls/MapControls.tsx";
import MapEvents from "feature/map/Map.Events.tsx";

export default function App() {
  const { addMarker, markers, enable } = useMarkers();

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  const handleMapClick = (event: L.LeafletMouseEvent) => {
    if (enable) {
      const position = new L.LatLng(event.latlng.lat, event.latlng.lng);
      addMarker(position);
    }
  };
  return (
    <MainLayout>
      <Map
        center={nbgCenter}
        zoom={8}
        scrollWheelZoom={true}
        bounceAtZoomLimits
      >
        <MapControls />
        <MapBounds disableZoom={false} />
        <LayerGroupMarker positions={markers} />
        <MapEvents onClick={handleMapClick} />
      </Map>
    </MainLayout>
  );
}
