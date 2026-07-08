import type { Decorator, Preview } from "@storybook/react";
import { Provider } from "react-redux";
import { MapContainer } from "react-leaflet";
import { setupStore } from "../src/infrastructure/redux/store.ts";
import { installGeoSim } from "../src/infrastructure/geo-simulation/geo-simulation.ts";
import { AppDialogContextProvider } from "../src/ports/context/app-dialog/app-dialog.provider.tsx";
import { TileServerContext } from "../src/ports/context/tile-server/tile-server.context.ts";
import { baseMaps } from "../src/infrastructure/tile-server/base-maps.ts";
import "@sakun/system.css";
import "leaflet/dist/leaflet.css";
import "../src/ports/components/base-maps/style-overrides.css";

// Desktop browsers rarely have a meaningful real geolocation reading (no GPS, IP-based
// or phone-synced at best), so stories that depend on it (DistanceControl's "My
// Location", Marker.OwnPosition, NavigatorControl) would otherwise be undemoable. This
// swaps in the same simulated-route shim used for local dev.
installGeoSim(1000);

const NUREMBERG_CENTER: [number, number] = [49.4521, 11.0767];
const tileProviderNames = Object.keys(baseMaps);

const withAppProviders: Decorator = (Story, context) => (
  <Provider store={setupStore(context.parameters.reduxState ?? {})}>
    <AppDialogContextProvider>
      <Story />
    </AppDialogContextProvider>
  </Provider>
);

const withTileServer: Decorator = (Story, context) => {
  const selectedBaseMap = context.globals.tileProvider ?? tileProviderNames[0];
  return (
    <TileServerContext.Provider value={{ baseMaps, selectedBaseMap, setSelectedBaseMap: () => {} }}>
      <Story />
    </TileServerContext.Provider>
  );
};

const withMap: Decorator = (Story, context) => {
  if (!context.parameters.map) return <Story />;
  return (
    <MapContainer center={NUREMBERG_CENTER} zoom={8} style={{ height: "400px", width: "100%" }}>
      <Story />
    </MapContainer>
  );
};

const preview: Preview = {
  decorators: [withAppProviders, withTileServer, withMap],
  globalTypes: {
    tileProvider: {
      name: "Tile Provider",
      description: "Base map tile layer",
      defaultValue: tileProviderNames[0],
      toolbar: {
        icon: "photo",
        items: tileProviderNames,
        title: "Tile Provider",
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
