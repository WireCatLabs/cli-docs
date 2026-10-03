import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://localhost:4318", trace: "retain-on-failure" },
  webServer: {
    command: "pnpm dev --port 4318",
    url: "http://localhost:4318",
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
})
