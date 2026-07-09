import { defineConfig, devices } from "@playwright/test";
import { API_URL, BASE_URL, PORT } from "./e2e/helpers/config.ts";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  // Tests share one persistent Postgres instance and, in several specs, the same
  // seeded leader account — not safe to run concurrently without further per-test
  // data isolation, so the whole suite runs as a single worker (see e2e/README.md).
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      args: [`--unsafely-treat-insecure-origin-as-secure=${API_URL}`],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Invoke vite directly rather than through the "dev" package.json script — that
    // script hardcodes --port 3000, which conflicts with overriding it here.
    command: `npx vite --host --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
    env: {
      VITE_API_URL: API_URL,
    },
  },
});
