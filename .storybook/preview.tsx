import type { Decorator, Preview } from "@storybook/react";
import { Provider } from "react-redux";
import { MapContainer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { setupStore } from "../src/infrastructure/redux/store.ts";
import { installGeoSim } from "../src/infrastructure/geo-simulation/geo-simulation.ts";
import { TileServerContext } from "../src/ports/context/tile-server/tile-server.context.ts";
import { baseMaps, createBaseMaps } from "../src/infrastructure/tile-server/base-maps.ts";
import { I18nContext } from "../src/ports/context/i18n/i18n.context.ts";
import { translations } from "../src/ports/i18n/translations/index.ts";
import { languages, languageLabels, type Language } from "../src/ports/i18n/language.ts";
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
    <Story />
  </Provider>
);

// Leaflet tile layers are stateful and can only ever be attached to one live map at a
// time. The app's own `baseMaps` singleton is fine for the real app (one map, one
// lifetime), but Storybook mounts a fresh Leaflet map per story — reusing those same
// singleton layer instances across many different map instances corrupts Leaflet's
// internal bookkeeping. `useState` here mints an independent set once per story mount
// instead, scoped to that story's own map.
const withTileServer: Decorator = (Story, context) => {
  // Decorators render as part of the story's React tree on every render, so calling a
  // hook here is safe despite the naming-convention check below.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [layers] = useState(() => createBaseMaps());
  const selectedBaseMap = context.globals.tileProvider ?? tileProviderNames[0];
  return (
    <TileServerContext.Provider value={{ baseMaps: layers, selectedBaseMap, setSelectedBaseMap: () => {} }}>
      <Story />
    </TileServerContext.Provider>
  );
};

// Keeps the map's actual tile layer in sync with the selected base map and swaps it
// live when the "Tile Provider" toolbar changes — mirrors the add/remove-all-then-add
// logic BaseMapsLayers.tsx uses in the real app, since most stories don't render that
// component themselves. Takes `selectedBaseMap` as a prop (rather than reading it via
// useTileServer()) and mints its own layer instances: a sibling rendered by a decorator
// reading TileServerContext here reliably got the context's default (empty) value
// instead of withTileServer's provided one, for reasons that didn't reduce to a normal
// misordered-provider explanation — this sidesteps that entirely.
// eslint-disable-next-line react-refresh/only-export-components
function StorybookTileLayer({ selectedBaseMap }: { selectedBaseMap: string }) {
  const [layers] = useState(() => createBaseMaps());
  const map = useMap();

  useEffect(() => {
    const activeLayer = layers[selectedBaseMap];
    Object.values(layers).forEach((layer) => {
      if (layer !== activeLayer && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    if (!map.hasLayer(activeLayer)) {
      map.addLayer(activeLayer);
    }
    return () => {
      if (map.hasLayer(activeLayer)) {
        map.removeLayer(activeLayer);
      }
    };
  }, [layers, selectedBaseMap, map]);

  return null;
}

const withMap: Decorator = (Story, context) => {
  if (!context.parameters.map) return <Story />;
  const selectedBaseMap = context.globals.tileProvider ?? tileProviderNames[0];
  return (
    <MapContainer center={NUREMBERG_CENTER} zoom={8} style={{ height: "400px", width: "100%" }}>
      <StorybookTileLayer selectedBaseMap={selectedBaseMap} />
      <Story />
    </MapContainer>
  );
};

const withI18n: Decorator = (Story, context) => {
  const language = (context.globals.language ?? "en") as Language;
  return (
    <I18nContext.Provider value={{ language, setLanguage: () => {}, t: translations[language] }}>
      <Story />
    </I18nContext.Provider>
  );
};

const preview: Preview = {
  decorators: [withAppProviders, withTileServer, withMap, withI18n],
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
    language: {
      name: "Language",
      description: "UI translation language",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: languages.map((language) => ({ value: language, title: languageLabels[language] })),
        title: "Language",
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
