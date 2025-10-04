import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";
// import * as path from "node:path";
// import * as fs from "node:fs";
import viteBasicSslPlugin from "@vitejs/plugin-basic-ssl";

// Load self-signed certificates (adjust paths as needed)
/*
const certDir = path.resolve(__dirname, "cert");
const https = {
  key: fs.readFileSync(path.join(certDir, "localhost-key.pem")),
  cert: fs.readFileSync(path.join(certDir, "localhost.pem")),
};
*/
// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-leaflet",
  plugins: [
    tsconfigPaths(),
    react(),
    checker({ typescript: true }),
    viteBasicSslPlugin(),
  ],
  server: {
    port: 3000,
    /*https: import.meta.env.NODE_MODE === "development" ? test : undefined*/
  },
});
