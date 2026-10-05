import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { copiedInstallationTool, enableSiteEvents, trackSiteEvent } from "../lib/site-events"

const context = { tool: "tg" as const, locale: "en", surface: "hero" as const }
let browser: {
  location: { hostname: string }
  wirecatEvents?: unknown[]
  gtag: ReturnType<typeof vi.fn>
  ym: ReturnType<typeof vi.fn>
}
beforeEach(() => {
  browser = { location: { hostname: "wirecat.dev" }, gtag: vi.fn(), ym: vi.fn() }
  vi.stubGlobal("window", browser)
})
afterEach(() => vi.unstubAllGlobals())

describe("installation intent measurement", () => {
  it("queues before initialization and delivers each action once after readiness", () => {
    trackSiteEvent("installation_command_copy", context)
    expect(browser.gtag).not.toHaveBeenCalled()
    enableSiteEvents()
    enableSiteEvents()
    expect(browser.gtag).toHaveBeenCalledExactlyOnceWith("event", "installation_command_copy", context)
    expect(browser.ym).toHaveBeenCalledExactlyOnceWith(113377132, "reachGoal", "installation_command_copy", context)
    trackSiteEvent("setup_guide_open", { ...context, tool: "max", locale: "es", surface: "closing" })
    expect(browser.gtag).toHaveBeenCalledTimes(2)
  })
  it("retains only tool, locale and surface rather than clipboard/message payloads", () => {
    enableSiteEvents()
    trackSiteEvent("installation_command_copy", { ...context, clipboard: "private text" } as typeof context)
    expect(browser.gtag.mock.calls[0][2]).toEqual(context)
  })
  it("does not collect local/preview activity or invalid locales", () => {
    browser.location.hostname = "localhost"
    trackSiteEvent("installation_command_copy", context)
    expect(browser.wirecatEvents).toBeUndefined()
    browser.location.hostname = "wirecat.dev"
    trackSiteEvent("installation_command_copy", { ...context, locale: "invalid" })
    expect(browser.wirecatEvents).toBeUndefined()
  })
  it("keeps tracking failures from breaking the visitor's successful action", () => {
    browser.gtag.mockImplementation(() => {
      throw new Error("blocked")
    })
    enableSiteEvents()
    expect(() => trackSiteEvent("installation_command_copy", context)).not.toThrow()
    expect(browser.ym).toHaveBeenCalledTimes(1)
  })
  it("recognizes the published Windows and npm installation forms", () => {
    expect(copiedInstallationTool("npm install -g @leemour/tg-cli && tg skill install --for all")).toBe("tg")
    expect(copiedInstallationTool("& (...) -Tool max -Agent all")).toBe("max")
    expect(copiedInstallationTool("tg mcp config")).toBeUndefined()
  })
})
