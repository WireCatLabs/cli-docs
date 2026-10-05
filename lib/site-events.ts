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
const productionHostname = new URL(siteConfig.url).hostname

export function flushSiteEvents(): void {
  const browser = window as TrackingWindow
  if (!browser.wirecatTrackingReady || !browser.gtag || !browser.ym) return
  for (const event of browser.wirecatEvents?.splice(0) ?? []) {
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
  browser.wirecatEvents ??= []
  const queue = browser.wirecatEvents
  if (queue.length < 50)
    queue.push({ name, context: { tool: context.tool, locale: context.locale, surface: context.surface } })
  flushSiteEvents()
}

export function copiedInstallationTool(command: string): "tg" | "max" | undefined {
  return (/@leemour\/(tg|max)-cli\b/.exec(command)?.[1] ?? /-Tool (tg|max)\b/.exec(command)?.[1]) as
    | "tg"
    | "max"
    | undefined
}

export function enableSiteEvents(): void {
  const browser = window as TrackingWindow
  browser.wirecatTrackingReady = true
  flushSiteEvents()
}
