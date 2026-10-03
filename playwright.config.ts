import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://localhost:4319", trace: "retain-on-failure" },
  webServer: {
    command: "pnpm dev --port 4319",
    url: "http://localhost:4319",
    reuseExistingServer: false,
    timeout: 60000,
  },
})
