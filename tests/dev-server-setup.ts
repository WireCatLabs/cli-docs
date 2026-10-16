import type { FullConfig } from "@playwright/test"

// Independent route families compile on first dev access; keep startup work
// outside assertions that measure navigation of an already-built production page.
export default async function setup(config: FullConfig) {
  if (process.env.PLAYWRIGHT_EXPORT === "1") return
  const baseURL = config.projects[0].use.baseURL
  if (!baseURL) throw new Error("Browser setup requires a baseURL")
  for (const path of ["/llms.mdx/docs/installation/content.md", "/", "/ru", "/es"]) {
    const response = await fetch(new URL(path, baseURL), {
      signal: AbortSignal.timeout(60_000),
    })
    if (!response.ok) throw new Error(`Development readiness failed for ${path}: HTTP ${response.status}`)
    await response.text()
  }
}
