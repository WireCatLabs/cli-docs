import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./tests",
  // Parallelize individual tests so the large audit file does not monopolize one worker.
  fullyParallel: true,
  // GitHub runners for public repos have 4 vCPUs; 8 workers starved the axe scans into timeouts.
  workers: process.env.CI ? 4 : 2,
  use: { baseURL: "http://localhost:4319", trace: "retain-on-failure" },
  webServer: {
    command: process.env.PLAYWRIGHT_EXPORT === "1" ? "node scripts/serve-export.mjs out 4319" : "pnpm dev --port 4319",
    // The first docs request compiles the docs route on the dev server; waiting here keeps that out of test timeouts.
    url: "http://localhost:4319/en/docs/installation",
    reuseExistingServer: false,
    timeout: 60000,
  },
})
