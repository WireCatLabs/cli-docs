import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { copiedInstallationTool, enableSiteEvents, type SiteEventSink, trackSiteEvent } from "../lib/site-events"

const context = { tool: "tg" as const, locale: "en", surface: "hero" as const }
let browser: { location: { hostname: string }; wirecatEvents?: unknown[]; sessionStorage: { setItem: unknown } }
let sink: { capture: ReturnType<typeof vi.fn<SiteEventSink["capture"]>> }
beforeEach(() => {
  browser = { location: { hostname: "wirecat.dev" }, sessionStorage: { setItem: vi.fn() } }
  sink = { capture: vi.fn<SiteEventSink["capture"]>() }
  vi.stubGlobal("window", browser)
})
afterEach(() => vi.unstubAllGlobals())

describe("installation intent measurement", () => {
  it("queues before PostHog loads and delivers each action once after it is ready", () => {
    trackSiteEvent("installation_command_copy", context)
    expect(sink.capture).not.toHaveBeenCalled()
    enableSiteEvents(sink)
    enableSiteEvents(sink)
    expect(sink.capture).toHaveBeenCalledExactlyOnceWith("installation_command_copy", context, { send_instantly: true })
    trackSiteEvent("setup_guide_open", { ...context, tool: "max", locale: "es", surface: "closing" })
    expect(sink.capture).toHaveBeenLastCalledWith(
      "setup_guide_open",
      { tool: "max", locale: "es", surface: "closing" },
      { send_instantly: true },
    )
  })
  it("keeps pending actions out of browser storage, which needs consent", () => {
    trackSiteEvent("installation_command_copy", context)
    expect(browser.sessionStorage.setItem).not.toHaveBeenCalled()
    expect(browser.wirecatEvents).toHaveLength(1)
  })
  it("retains only tool, locale and surface rather than clipboard/message payloads", () => {
    enableSiteEvents(sink)
    trackSiteEvent("installation_command_copy", { ...context, clipboard: "private text" } as typeof context)
    expect(sink.capture.mock.calls[0][1]).toEqual(context)
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
    sink.capture.mockImplementation(() => {
      throw new Error("blocked")
    })
    enableSiteEvents(sink)
    expect(() => trackSiteEvent("installation_command_copy", context)).not.toThrow()
    expect(sink.capture).toHaveBeenCalledTimes(1)
  })
  it("recognizes the published Windows and npm installation forms", () => {
    expect(copiedInstallationTool("npm install -g @wirecat/tg-cli && tg skill install --for all")).toBe("tg")
    expect(copiedInstallationTool("npm install -g @wirecat/max-cli && max skill install --for all")).toBe("max")
    expect(copiedInstallationTool("& (...) -Tool max -Agent all")).toBe("max")
    expect(copiedInstallationTool("tg mcp config")).toBeUndefined()
  })
})
