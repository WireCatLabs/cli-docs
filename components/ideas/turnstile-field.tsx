"use client"

import { useEffect, useRef } from "react"
import { ideasSample } from "@/lib/ideas"
import { loadTurnstile } from "@/lib/turnstile"
import siteConfig from "@/site.config.json"

// Cloudflare's test key that always passes, so the sample screens show the real widget.
const sampleSiteKey = "1x00000000000000000000AA"

/** Calls `onToken` with a fresh token, or "" when it expires; `resetKey` asks for a new one after a submit. */
export function TurnstileField({
  lang,
  onToken,
  resetKey,
}: {
  lang: string
  onToken: (token: string) => void
  resetKey: number
}) {
  const widget = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string>(undefined)
  const callback = useRef(onToken)
  callback.current = onToken
  const siteKey = siteConfig.ideas.turnstileSiteKey || (ideasSample ? sampleSiteKey : "")

  useEffect(() => {
    // No key means the API runs without Turnstile (development), so the form needs no widget.
    if (!siteKey) return callback.current("off")
    let cancelled = false
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !widget.current) return
        widgetId.current = turnstile.render(widget.current, {
          // The real key allows wirecat.dev only; the local API skips the check, so any token passes there.
          sitekey: window.location.hostname === "localhost" ? sampleSiteKey : siteKey,
          language: lang,
          callback: (value: string) => callback.current(value),
          "expired-callback": () => callback.current(""),
          "error-callback": () => callback.current(""),
        })
      })
      .catch(() => callback.current(""))
    return () => {
      cancelled = true
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    }
  }, [siteKey, lang])

  useEffect(() => {
    if (resetKey && widgetId.current) window.turnstile?.reset(widgetId.current)
  }, [resetKey])

  return siteKey ? <div ref={widget} className="ideas-turnstile" /> : null
}
