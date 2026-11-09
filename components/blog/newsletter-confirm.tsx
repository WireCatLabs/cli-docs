"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { blogWords } from "@/lib/blog-words"

export function NewsletterConfirm({ lang, apiUrl, blogHref }: { lang: string; apiUrl: string; blogHref: string }) {
  const words = blogWords(lang).newsletter.confirm
  const [token, setToken] = useState<string>()
  const [state, setState] = useState<"sending" | "done" | "invalid" | "failed">("sending")
  const sent = useRef(false)

  const confirm = useCallback(
    async (value: string) => {
      setState("sending")
      try {
        const response = await fetch(`${apiUrl}/v1/subscriber_confirmations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: value }),
        })
        setState(response.ok ? "done" : response.status === 404 ? "invalid" : "failed")
      } catch {
        setState("failed")
      }
    },
    [apiUrl],
  )

  // Confirms on open, from the browser: mail scanners that prefetch the link run no script, so they cannot confirm.
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("token") ?? ""
    setToken(value)
    // A token works once: a second run of this effect would turn "confirmed" into "link already used".
    if (!value || sent.current) return
    sent.current = true
    confirm(value)
  }, [confirm])

  if (token === undefined) return null
  return (
    <div className="blog-confirm">
      {!token ? (
        <p role="status">{words.missing}</p>
      ) : state === "sending" ? (
        <p role="status">{words.sending}</p>
      ) : state === "failed" ? (
        <>
          <p role="alert">{words.failed}</p>
          <button type="button" onClick={() => confirm(token)}>
            {words.submit}
          </button>
        </>
      ) : (
        <p role="status">{state === "done" ? words.done : words.invalid}</p>
      )}
      {state === "done" && <p>{words.about}</p>}
      <p>
        <Link href={blogHref}>{words.blog}</Link>
      </p>
    </div>
  )
}
