import siteConfig from "@/site.config.json"

export type InstallationEventContext = {
  tool: "tg" | "max"
  locale: string
  surface: "hero" | "footer" | "closing" | "installation"
}
type SiteEvent = {
  name: "installation_command_copy" | "setup_guide_open"
  context: InstallationEventContext
}
type TrackingWindow = Window & {
  wirecatEvents?: SiteEvent[]
  wirecatTrackingReady?: boolean
  gtag?: (...args: unknown[]) => void
  ym?: (...args: unknown[]) => void
}
const pendingKey = "wirecat.pending-installation-events"
const eventNames = ["installation_command_copy", "setup_guide_open"]
const surfaces = ["hero", "footer", "closing", "installation"]

function eventQueue(browser: TrackingWindow): SiteEvent[] {
  if (browser.wirecatEvents) return browser.wirecatEvents
  browser.wirecatEvents = []
  try {
    const saved = JSON.parse(browser.sessionStorage.getItem(pendingKey) ?? "null")
    if (saved?.expires > Date.now() && Array.isArray(saved.events))
      for (const event of saved.events.slice(0, 50)) {
        const context = event?.context
        if (
          eventNames.includes(event?.name) &&
          ["tg", "max"].includes(context?.tool) &&
          ["en", "ru", "es"].includes(context?.locale) &&
          surfaces.includes(context?.surface)
        )
          browser.wirecatEvents.push({
            name: event.name,
            context: { tool: context.tool, locale: context.locale, surface: context.surface },
          })
      }
  } catch {}
  return browser.wirecatEvents
}

function savePending(browser: TrackingWindow) {
  try {
    if (browser.wirecatEvents?.length)
      browser.sessionStorage.setItem(
        pendingKey,
        JSON.stringify({ expires: Date.now() + 300000, events: browser.wirecatEvents }),
      )
    else browser.sessionStorage.removeItem(pendingKey)
  } catch {}
}

const productionHostname = new URL(siteConfig.url).hostname

export function flushSiteEvents(): void {
  const browser = window as TrackingWindow
  if (!browser.wirecatTrackingReady || !browser.gtag || !browser.ym) return
  const pending = eventQueue(browser).splice(0)
  savePending(browser)
  for (const event of pending) {
    try {
      browser.gtag("event", event.name, event.context)
    } catch {}
    try {
      browser.ym(siteConfig.analytics.yandexMetrikaId, "reachGoal", event.name, event.context)
    } catch {}
  }
}

export function trackSiteEvent(name: SiteEvent["name"], context: InstallationEventContext): void {
  if (typeof window === "undefined" || window.location.hostname !== productionHostname) return
  if (!["en", "ru", "es"].includes(context.locale) || !["tg", "max"].includes(context.tool)) return
  const browser = window as TrackingWindow
  const queue = eventQueue(browser)
  if (queue.length < 50)
    queue.push({ name, context: { tool: context.tool, locale: context.locale, surface: context.surface } })
  savePending(browser)
  flushSiteEvents()
}

export function copiedInstallationTool(command: string): "tg" | "max" | undefined {
  return (/@wirecat\/(tg|max)-cli\b/.exec(command)?.[1] ?? /-Tool (tg|max)\b/.exec(command)?.[1]) as
    | "tg"
    | "max"
    | undefined
}

export function enableSiteEvents(): void {
  const browser = window as TrackingWindow
  browser.wirecatTrackingReady = true
  flushSiteEvents()
}
