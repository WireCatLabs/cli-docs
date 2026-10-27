"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { blogWords } from "@/lib/blog-words"

export function NewsletterConfirm({ lang, apiUrl, blogHref }: { lang: string; apiUrl: string; blogHref: string }) {
  const words = blogWords(lang).newsletter.confirm
  const [token, setToken] = useState<string>()
  const [state, setState] = useState<"idle" | "sending" | "done" | "invalid" | "failed">("idle")

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get("token") ?? "")
  }, [])

  const confirm = async () => {
    setState("sending")
    try {
      const response = await fetch(`${apiUrl}/v1/subscriber_confirmations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      setState(response.ok ? "done" : response.status === 404 ? "invalid" : "failed")
    } catch {
      setState("failed")
    }
  }

  if (token === undefined) return null
  const message = { done: words.done, invalid: words.invalid, failed: words.failed }[state as "done"]
  return (
    <div className="blog-confirm">
      {token ? (
        state === "done" || state === "invalid" ? (
          <p role="status">{message}</p>
        ) : (
          <>
            <p>{words.text}</p>
            <button type="button" onClick={confirm} disabled={state === "sending"}>
              {state === "sending" ? words.sending : words.submit}
            </button>
            {state === "failed" && <p role="alert">{message}</p>}
          </>
        )
      ) : (
        <p role="status">{words.missing}</p>
      )}
      <p>
        <Link href={blogHref}>{words.blog}</Link>
      </p>
    </div>
  )
}
