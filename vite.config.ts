import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/react-leaflet",
  plugins: [tsconfigPaths(), react(), checker({ typescript: true })],
  server: {
    port: 3000,
  },
});
