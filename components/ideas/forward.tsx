"use client"

import { useEffect } from "react"
import { ideasPath } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"

/**
 * The older addresses of one idea and of the form, kept because status emails and sign-in return paths use them:
 * both now open on the ideas page itself.
 */
export function ForwardToBoard({ lang, compose = false }: { lang: string; compose?: boolean }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (compose) params.set("compose", "1")
    const query = params.toString()
    window.location.replace(`${ideasPath(lang)}${query ? `?${query}` : ""}`)
  }, [lang, compose])
  return (
    <p className="ideas-standfirst" role="status">
      {ideasWords(lang).loading}
    </p>
  )
}
