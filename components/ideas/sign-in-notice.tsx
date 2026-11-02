"use client"

import { useEffect, useState } from "react"
import { ideasWords } from "@/lib/ideas/words"

type GoogleError = keyof ReturnType<typeof ideasWords>["google"]

/** A failed Google sign-in comes back with `?sign_in_error=`; say what happened, then drop it from the address. */
export function SignInNotice({ lang }: { lang: string }) {
  const messages = ideasWords(lang).google
  const [code, setCode] = useState<GoogleError>()
  useEffect(() => {
    const url = new URL(window.location.href)
    const value = url.searchParams.get("sign_in_error")
    if (!value) return
    if (value in messages) setCode(value as GoogleError)
    url.searchParams.delete("sign_in_error")
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`)
  }, [messages])
  if (!code) return null
  return (
    <p className="ideas-note" role="status">
      {messages[code]}
    </p>
  )
}
