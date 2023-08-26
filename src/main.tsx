import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "./index.css";
import { ContextProviders } from "./context/context-providers.tsx";
import { ApolloProvider } from "@apollo/client";
import { client } from "./cache/client.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ContextProviders>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ContextProviders>
  </React.StrictMode>
);
