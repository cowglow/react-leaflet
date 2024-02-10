import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "./index.css";
import { ContextProviders } from "./context/context-providers.tsx";
// import { CssBaseline } from "@mui/joy";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextProviders>
      <App />
    </ContextProviders>
  </React.StrictMode>,
);
