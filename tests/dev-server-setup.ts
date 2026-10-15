import type { FullConfig } from "@playwright/test"

// webServer waits for HTML readiness. The independent Markdown route also compiles
// on its first dev request; perform that startup work before reader test deadlines.
export default async function setup(config: FullConfig) {
  if (process.env.PLAYWRIGHT_EXPORT === "1") return
  const baseURL = config.projects[0].use.baseURL
  if (!baseURL) throw new Error("Browser setup requires a baseURL")
  const response = await fetch(new URL("/llms.mdx/docs/installation/content.md", baseURL), {
    signal: AbortSignal.timeout(60_000),
  })
  if (!response.ok) throw new Error(`Markdown readiness failed: HTTP ${response.status}`)
  await response.text()
}
