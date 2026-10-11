import type { PostHog } from "posthog-js"
import { describe, expect, it, vi } from "vitest"
import { analyticsEnabled, applyConsent, posthogOptions, startConsentedFeatures } from "../lib/analytics"

const client = (status: "granted" | "denied" | "pending") =>
  ({
    get_explicit_consent_status: vi.fn(() => status),
    opt_in_capturing: vi.fn(),
    opt_out_capturing: vi.fn(),
    startSessionRecording: vi.fn(),
    stopSessionRecording: vi.fn(),
  }) as unknown as PostHog & Record<string, ReturnType<typeof vi.fn>>

describe("analytics consent", () => {
  it("stays off without a project key and outside the production host", () => {
    expect(analyticsEnabled("wirecat.dev", "")).toBe(false)
    expect(analyticsEnabled("localhost", "phc_example")).toBe(false)
    expect(analyticsEnabled("wirecat.dev", "phc_example")).toBe(true)
  })
  it("counts unanswered visitors cookieless and keeps recording and autocapture off by default", () => {
    expect(posthogOptions).toMatchObject({
      api_host: "https://eu.i.posthog.com",
      cookieless_mode: "on_reject",
      opt_out_capturing_by_default: true,
      disable_session_recording: true,
      autocapture: false,
      session_recording: { maskAllInputs: true, maskTextSelector: "*" },
    })
  })
  it("starts recording only after an explicit acceptance", () => {
    const pending = client("pending")
    startConsentedFeatures(pending)
    expect(pending.startSessionRecording).not.toHaveBeenCalled()
    const granted = client("granted")
    startConsentedFeatures(granted)
    expect(granted.startSessionRecording).toHaveBeenCalledOnce()
  })
  it("opts in with recording on Accept and back out on Decline", () => {
    const posthog = client("pending")
    applyConsent(posthog, true)
    expect(posthog.opt_in_capturing).toHaveBeenCalledOnce()
    expect(posthog.startSessionRecording).toHaveBeenCalledOnce()
    applyConsent(posthog, false)
    expect(posthog.stopSessionRecording).toHaveBeenCalledOnce()
    expect(posthog.opt_out_capturing).toHaveBeenCalledOnce()
  })
})
