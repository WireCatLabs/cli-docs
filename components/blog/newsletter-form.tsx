"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import { blogWords } from "@/lib/blog-words"

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}
declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

const scriptUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  return new Promise((resolve, reject) => {
    const script =
      document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`) ?? document.createElement("script")
    script.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject()))
    script.addEventListener("error", () => reject())
    if (!script.parentElement) {
      script.src = scriptUrl
      script.async = true
      document.head.append(script)
    }
  })
}

/** Rendered only when `newsletter.apiUrl` and `newsletter.turnstileSiteKey` are set in site.config.json. */
export function NewsletterForm({ lang, apiUrl, siteKey }: { lang: string; apiUrl: string; siteKey: string }) {
  const words = blogWords(lang).newsletter
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle")
  const [token, setToken] = useState("")
  const widget = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string>(undefined)

  useEffect(() => {
    let cancelled = false
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !widget.current) return
        widgetId.current = turnstile.render(widget.current, {
          sitekey: siteKey,
          language: lang,
          callback: (value: string) => setToken(value),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        })
      })
      .catch(() => setState("failed"))
    return () => {
      cancelled = true
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
    }
  }, [siteKey, lang])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = new FormData(event.currentTarget).get("email")
    setState("sending")
    try {
      const response = await fetch(`${apiUrl}/v1/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, language: lang, turnstile_token: token }),
      })
      setState(response.ok ? "done" : "failed")
    } catch {
      setState("failed")
    }
    // A Turnstile token works once, so a retry needs a fresh one.
    setToken("")
    window.turnstile?.reset(widgetId.current)
  }

  return (
    <section className="blog-newsletter" aria-labelledby="blog-newsletter">
      <h2 id="blog-newsletter">{words.title}</h2>
      <p>{words.text}</p>
      {state === "done" ? (
        <p role="status">{words.done}</p>
      ) : (
        <form onSubmit={submit}>
          <label htmlFor="blog-newsletter-email">{words.label}</label>
          <div>
            <input id="blog-newsletter-email" name="email" type="email" autoComplete="email" required />
            <button type="submit" disabled={state === "sending" || !token}>
              {state === "sending" ? words.sending : words.submit}
            </button>
          </div>
          <div ref={widget} className="blog-turnstile" />
          {state === "failed" && <p role="alert">{words.failed}</p>}
        </form>
      )}
    </section>
  )
}
