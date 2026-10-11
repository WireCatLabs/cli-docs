import type { PostHog, PostHogConfig } from "posthog-js"
import siteConfig from "@/site.config.json"

export type ConsentChoice = "granted" | "denied" | "pending"

const { posthogKey, posthogHost } = siteConfig.analytics
const productionHostname = new URL(siteConfig.url).hostname

export const openConsentEvent = "wirecat:open-consent"

export function analyticsEnabled(hostname: string, key: string = posthogKey): boolean {
  return key.trim() !== "" && hostname === productionHostname
}

// "No answer" is treated as a refusal: events are counted without cookies or browser storage until the visitor
// accepts, and only an explicit choice writes PostHog's consent record.
export const posthogOptions: Partial<PostHogConfig> = {
  api_host: posthogHost,
  defaults: "2026-08-30",
  cookieless_mode: "on_reject",
  opt_out_capturing_by_default: true,
  opt_out_capturing_persistence_type: "localStorage",
  person_profiles: "identified_only",
  autocapture: false,
  capture_heatmaps: false,
  capture_dead_clicks: false,
  capture_exceptions: false,
  disable_surveys: true,
  disable_session_recording: true,
  session_recording: { maskAllInputs: true, maskTextSelector: "*" },
}

export function startConsentedFeatures(posthog: PostHog): void {
  if (posthog.get_explicit_consent_status() === "granted") posthog.startSessionRecording()
}

export function applyConsent(posthog: PostHog, accepted: boolean): void {
  if (accepted) {
    posthog.opt_in_capturing({ captureEventName: false })
    posthog.startSessionRecording()
  } else {
    posthog.stopSessionRecording()
    posthog.opt_out_capturing()
    forgetSessionWindow()
  }
}

// opt_out_capturing() clears PostHog's cookie and local storage but leaves the tab's window id in session storage.
function forgetSessionWindow(): void {
  try {
    const prefix = `ph_${posthogKey}_`
    for (const key of Object.keys(window.sessionStorage))
      if (key.startsWith(prefix)) window.sessionStorage.removeItem(key)
  } catch {}
}

export function openConsentBanner(): void {
  window.dispatchEvent(new Event(openConsentEvent))
}
