import { defineConfig } from "@playwright/test"

const port = Number(process.env.PLAYWRIGHT_PORT ?? "4319")
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: "./tests",
  // Parallelize individual tests so the large audit file does not monopolize one worker.
  fullyParallel: true,
  workers: process.env.CI ? 8 : 2,
  use: { baseURL, trace: "retain-on-failure" },
  webServer: {
    command:
      process.env.PLAYWRIGHT_EXPORT === "1" ? `node scripts/serve-export.mjs out ${port}` : `pnpm dev --port ${port}`,
    // The first docs request compiles the docs route on the dev server; waiting here keeps that out of test timeouts.
    url: `${baseURL}/en/docs/installation`,
    reuseExistingServer: false,
    timeout: 60000,
  },
})
