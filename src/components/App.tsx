import L from "leaflet";
import MainLayout from "components/layout/MainLayout.tsx";
import { useMarkers } from "hooks/use-markers.ts";
import Map from "feature/map/Map.tsx";
import LayerGroupMarker from "components/layer-groups/LayerGroup.Markers.tsx";
import MapBounds from "components/layer-groups/MapBounds.ts";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "context/state/redux-store.ts";
// import {
//   decrement,
//   increment,
//   incrementAsync,
//   incrementByAmount,
// } from "context/state/counter/counterSlice.ts";
import MapControls from "components/map-controls/MapControls.tsx";
// import MapEvents from "feature/map/Map.Events.tsx";
import {
  Circle,
  FeatureGroup,
  LayerGroup,
  LayersControl,
  Marker,
  Popup,
  Rectangle,
} from "react-leaflet";

export default function App() {
  const { markers } = useMarkers();
  // const dispatch = useDispatch();

  const nbgCenter = new L.LatLng(49.4521, 11.0767);

  // const handleMapClick = (event: L.LeafletMouseEvent) => {
  //   if (enable) {
  //     const position = new L.LatLng(event.latlng.lat, event.latlng.lng);
  //     console.log(position);
  //   }
  // };
  const center: L.LatLngTuple = [51.505, -0.09];
  const rectangle: L.LatLngTuple[] = [
    [51.49, -0.08],
    [51.5, -0.06],
  ];
  return (
    <MainLayout>
      <Map
        center={nbgCenter}
        zoom={8}
        scrollWheelZoom={true}
        bounceAtZoomLimits
      >
        <Marker position={center} />
        <MapControls />
        <MapBounds disableZoom={false} />
        <LayersControl position="topright">
          <LayersControl.Overlay name="Marker with popup">
            <Marker position={center}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Layer group with circles">
            <LayerGroup>
              <Circle
                center={center}
                pathOptions={{ fillColor: "blue" }}
                radius={200}
              />
              <Circle
                center={center}
                pathOptions={{ fillColor: "red" }}
                radius={100}
                stroke={false}
              />
              <LayerGroup>
                <Circle
                  center={[51.51, -0.08]}
                  pathOptions={{ color: "green", fillColor: "green" }}
                  radius={100}
                />
              </LayerGroup>
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Feature group">
            <FeatureGroup pathOptions={{ color: "purple" }}>
              <Popup>Popup in FeatureGroup</Popup>
              <Circle center={[51.51, -0.06]} radius={200} />
              <Rectangle bounds={rectangle} />
            </FeatureGroup>
          </LayersControl.Overlay>
        </LayersControl>
        <LayersControl collapsed={false}>
          <LayersControl.Overlay name="Markers" checked={true}>
            <LayerGroupMarker positions={markers} />
          </LayersControl.Overlay>
        </LayersControl>
        {/*<MapEvents onClick={handleMapClick} />*/}
      </Map>
    </MainLayout>
  );
}
