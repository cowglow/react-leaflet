import L from "leaflet";
import MainLayout from "components/layout/MainLayout.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import Map from "feature/map/Map.tsx";
import MapBounds from "components/layer-groups/MapBounds.ts";
import MapControls from "components/map-controls/MapControls.tsx";
import { Marker } from "react-leaflet";
import MarkerDefault from "components/markers/Marker.Default.tsx";

export default function App() {
  const { markers } = useMarkers();

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
        {[...markers].map((marker, index) => (
          <MarkerDefault key={index} position={marker} />
        ))}
        {/*<MapEvents onClick={handleMapClick} />*/}
      </Map>
    </MainLayout>
  );
}
