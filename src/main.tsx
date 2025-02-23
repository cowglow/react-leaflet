import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import Dialogs from "components/Dialogs.tsx";
import { ContextProviders } from "./context/context-providers.tsx";
import "./index.css";
import "@sakun/system.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextProviders>
      <App />
      <Dialogs />
    </ContextProviders>
  </React.StrictMode>,
);
