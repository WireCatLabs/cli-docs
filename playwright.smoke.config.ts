import { defineConfig } from "@playwright/test"
import fullConfig from "./playwright.config"

// Fast reader paths for local edits; CI invokes the full config directly.
export default defineConfig(fullConfig, {
  testMatch: [
    "stable-home.spec.ts",
    "doc-hints.spec.ts",
    "onboarding-merge.spec.ts",
    "search-playground.spec.ts",
    "browser-platform-setup.spec.ts",
  ],
  grep: /English root is complete|demo choices and return-home|term explanation opens on hover|installation deep links lead to tool guides|same query playground works|Windows visitors start/,
})
