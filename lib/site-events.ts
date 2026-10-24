import siteConfig from "@/site.config.json"

export type InstallationEventContext = {
  tool: "tg" | "max" | "wa"
  locale: string
  surface: "hero" | "footer" | "closing" | "installation"
}
type SiteEvent = {
  name: "installation_command_copy" | "setup_guide_open"
  context: InstallationEventContext
}
export type SiteEventSink = {
  capture: (name: string, properties: InstallationEventContext, options: { send_instantly: boolean }) => unknown
}
type TrackingWindow = Window & {
  wirecatEvents?: SiteEvent[]
  wirecatAnalytics?: SiteEventSink
}

const productionHostname = new URL(siteConfig.url).hostname

// The queue lives in memory only: before consent nothing may be written to the visitor's browser.
function eventQueue(browser: TrackingWindow): SiteEvent[] {
  browser.wirecatEvents ??= []
  return browser.wirecatEvents
}

export function flushSiteEvents(): void {
  const browser = window as TrackingWindow
  const sink = browser.wirecatAnalytics
  if (!sink) return
  for (const event of eventQueue(browser).splice(0)) {
    try {
      sink.capture(event.name, event.context, { send_instantly: true })
    } catch {}
  }
}

export function trackSiteEvent(name: SiteEvent["name"], context: InstallationEventContext): void {
  if (typeof window === "undefined" || window.location.hostname !== productionHostname) return
  if (!["en", "ru", "es"].includes(context.locale) || !["tg", "max", "wa"].includes(context.tool)) return
  const queue = eventQueue(window as TrackingWindow)
  if (queue.length < 50)
    queue.push({ name, context: { tool: context.tool, locale: context.locale, surface: context.surface } })
  flushSiteEvents()
}

export function copiedInstallationTool(command: string): "tg" | "max" | "wa" | undefined {
  if (/@wirecat\/whatsapp-cli\b/.test(command)) return "wa"
  return (/@wirecat\/(tg|max)-cli\b/.exec(command)?.[1] ?? /-Tool (tg|max)\b/.exec(command)?.[1]) as
    | "tg"
    | "max"
    | undefined
}

export function enableSiteEvents(sink: SiteEventSink): void {
  ;(window as TrackingWindow).wirecatAnalytics = sink
  flushSiteEvents()
}
