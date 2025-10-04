import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import Dialogs from "components/Dialogs.tsx";
import { ContextProviders } from "./context/context-providers.tsx";
import "@sakun/system.css";
// import {installGeoSim} from "./utils/geo-simulation/geo-simulation.ts";

if (import.meta.env.DEV) {
  // installGeoSim(1000); // emit new point every second
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextProviders>
      <App />
      <Dialogs />
    </ContextProviders>
  </React.StrictMode>,
);
