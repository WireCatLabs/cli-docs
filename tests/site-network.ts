import type { Page } from "@playwright/test"

const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"])

/** Observe without routing: request interception would disable the browser's HTTP cache. */
export function observeExternalRequests(page: Page): string[] {
  const external: string[] = []
  page.on("request", (request) => {
    const url = new URL(request.url())
    if ((url.protocol === "http:" || url.protocol === "https:") && !loopbackHosts.has(url.hostname)) {
      // Origins and paths explain the dependency without recording query values or headers.
      external.push(`${url.origin}${url.pathname}`)
    }
  })
  return external
}
