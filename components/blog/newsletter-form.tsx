"use client"

import { type FormEvent, useState } from "react"
import { blogWords } from "@/lib/blog-words"

/** Rendered only when `newsletter.endpoint` is set in site.config.json; the endpoint takes `{ email, lang }`. */
export function NewsletterForm({ lang, endpoint }: { lang: string; endpoint: string }) {
  const words = blogWords(lang).newsletter
  const [state, setState] = useState<"idle" | "sending" | "done" | "failed">("idle")
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = new FormData(event.currentTarget).get("email")
    setState("sending")
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang }),
      })
      setState(response.ok ? "done" : "failed")
    } catch {
      setState("failed")
    }
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
            <button type="submit" disabled={state === "sending"}>
              {state === "sending" ? words.sending : words.submit}
            </button>
          </div>
          {state === "failed" && <p role="alert">{words.failed}</p>}
        </form>
      )}
    </section>
  )
}
