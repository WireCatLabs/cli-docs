"use client"

import { MailX } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { ideas, ideasPath } from "@/lib/ideas"
import { IdeasError } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import { IdeasDown } from "./ideas-states"

type State = "working" | "done" | "invalid" | "missing" | "down"

/** Opened from the "stop these emails" link: `#token=` goes to the API and out of the address bar. */
export function UnsubscribePanel({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  const [state, setState] = useState<State>("working")
  const [token, setToken] = useState<string | null>(null)

  const run = useCallback((value: string) => {
    setState("working")
    ideas
      .unsubscribe(value)
      .then(() => setState("done"))
      .catch((error) => setState(error instanceof IdeasError && error.code === "invalid_token" ? "invalid" : "down"))
  }, [])

  useEffect(() => {
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token")
    if (!value) return setState("missing")
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
    setToken(value)
    run(value)
  }, [run])

  if (state === "down") return <IdeasDown lang={lang} onRetry={() => token && run(token)} />
  const text = {
    working: words.unsubscribe.working,
    done: words.unsubscribe.done,
    invalid: words.unsubscribe.invalid,
    missing: words.unsubscribe.missing,
  }[state]
  return (
    <section className="ideas-panel" aria-labelledby="unsubscribe-title" aria-busy={state === "working"}>
      <MailX className="ideas-panel-icon" aria-hidden="true" />
      <h1 id="unsubscribe-title">{words.unsubscribe.title}</h1>
      <p role="status">{text}</p>
      {state === "done" && <p>{words.unsubscribe.doneText}</p>}
      {state !== "working" && (
        <Link className="ideas-button ideas-button-quiet" href={ideasPath(lang)}>
          {words.signIn.continue}
        </Link>
      )}
    </section>
  )
}
