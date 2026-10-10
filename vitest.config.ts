import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    include: ["scripts/**/*.test.ts"],
    // Agents run suites side by side on 24 cores; one worker per core ran the machine out of memory (2026-10-11).
    maxWorkers: 4,
  },
})
