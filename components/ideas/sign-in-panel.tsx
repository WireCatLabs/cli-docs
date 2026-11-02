"use client"

import { MailCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, useEffect, useState } from "react"
import { GoogleIcon } from "@/components/brand-icons"
import { ideas, ideasPath } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"
import { TurnstileField } from "./turnstile-field"
import { useMember } from "./use-member"

type State = "idle" | "verifying" | "expired" | "sending" | "sent" | "failed"

const safeNext = (lang: string, next: string | null) => (next?.startsWith(`/${lang}/ideas`) ? next : ideasPath(lang))

/**
 * Google or an email link. Opened from an email it carries `?token=`, which it trades for a session; `next`
 * is where the reader goes once signed in. `embedded` drops the page heading when the post form shows it.
 */
export function SignInPanel({ lang, next, embedded = false }: { lang: string; next?: string; embedded?: boolean }) {
  const words = ideasWords(lang).signIn
  const router = useRouter()
  const member = useMember()
  const [state, setState] = useState<State>("idle")
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [resetKey, setResetKey] = useState(0)
  const [returnTo, setReturnTo] = useState(next ?? ideasPath(lang))

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const target = next ?? safeNext(lang, params.get("next"))
    setReturnTo(target)
    const linkToken = params.get("token")
    if (!linkToken) return
    setState("verifying")
    ideas
      .exchangeToken(linkToken)
      .then((result) => {
        if (result === "signed_in") router.replace(target)
        else setState(result === "expired" ? "expired" : "failed")
      })
      .catch(() => setState("failed"))
  }, [lang, next, router])

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState("sending")
    try {
      const result = await ideas.requestSignInLink(email, token, returnTo)
      setState(result === "sent" ? "sent" : "failed")
    } catch {
      setState("failed")
    }
    setToken("")
    setResetKey((key) => key + 1)
  }

  const Heading = embedded ? "h2" : "h1"

  if (state === "verifying")
    return (
      <section className="ideas-panel" aria-busy="true">
        <p role="status">{words.verifying}</p>
      </section>
    )

  if (state === "sent")
    return (
      <section className="ideas-panel" aria-labelledby="sign-in-sent">
        <MailCheck className="ideas-panel-icon" aria-hidden="true" />
        <Heading id="sign-in-sent" tabIndex={-1} ref={(heading: HTMLHeadingElement | null) => heading?.focus()}>
          {words.check}
        </Heading>
        <p role="status">{words.checkText(email)}</p>
        <button type="button" className="ideas-button ideas-button-quiet" onClick={() => setState("idle")}>
          {words.other}
        </button>
      </section>
    )

  if (member && state === "idle" && !embedded)
    return (
      <section className="ideas-panel" aria-labelledby="sign-in-title">
        <Heading id="sign-in-title">{words.title}</Heading>
        <p>{words.signedIn(member.email)}</p>
        <div className="ideas-actions">
          <Link className="ideas-button" href={returnTo}>
            {words.continue}
          </Link>
          <button
            type="button"
            className="ideas-button ideas-button-quiet"
            onClick={() => ideas.signOut().then(() => window.location.reload())}
          >
            {words.signOut}
          </button>
        </div>
      </section>
    )

  return (
    <section className="ideas-panel" aria-labelledby="sign-in-title">
      <Heading id="sign-in-title">{state === "expired" ? words.expired : words.title}</Heading>
      <p>{state === "expired" ? words.expiredText : words.intro}</p>
      <a className="ideas-button ideas-google" href={ideas.googleSignInUrl(returnTo)}>
        <GoogleIcon />
        {words.google}
      </a>
      <p className="ideas-or">
        <span>{words.or}</span>
      </p>
      <form className="ideas-form" onSubmit={send}>
        <label htmlFor="sign-in-email">{words.emailLabel}</label>
        <input
          id="sign-in-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TurnstileField lang={lang} onToken={setToken} resetKey={resetKey} />
        <button type="submit" className="ideas-button" disabled={state === "sending" || !token}>
          {state === "sending" ? words.sending : words.send}
        </button>
        {state === "failed" && (
          <p className="ideas-error" role="alert">
            {words.failed}
          </p>
        )}
      </form>
    </section>
  )
}
