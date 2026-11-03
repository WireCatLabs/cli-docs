"use client"

import { CircleCheck, LoaderCircle, MailCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, type MouseEvent, useEffect, useLayoutEffect, useState } from "react"
import { GoogleIcon } from "@/components/brand-icons"
import { ideas, ideasPath, maskEmail, safeReturnPath } from "@/lib/ideas"
import { boardWords } from "@/lib/ideas/board-words"
import { asLocale, IdeasError } from "@/lib/ideas/types"
import { errorText, ideasWords } from "@/lib/ideas/words"
import { announceSignIn, isSignInPopup } from "./board/popup"
import { TurnstileField } from "./turnstile-field"
import { useMember } from "./use-member"

type State = "idle" | "verifying" | "signed-in" | "expired" | "sending" | "sent" | "failed" | "popup-done"

/** Long enough to read "You are signed in", short enough not to feel like a wait. */
const landingPauseMs = 1200

/** Reads `#token=` from the emailed link and takes it out of the address bar before anything else runs. */
function takeLinkToken() {
  const token = new URLSearchParams(window.location.hash.slice(1)).get("token")
  if (token) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
  return token
}

/**
 * Google or an email link. Opened from the email it trades `#token=` for a session; `next` is where the reader
 * goes once signed in. `embedded` drops the page heading when the post form shows it.
 */
export function SignInPanel({ lang, next, embedded = false }: { lang: string; next?: string; embedded?: boolean }) {
  const words = ideasWords(lang).signIn
  const account = ideasWords(lang).account
  const locale = asLocale(lang)
  const router = useRouter()
  const member = useMember()
  const [state, setState] = useState<State>("idle")
  const [failure, setFailure] = useState("")
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [resetKey, setResetKey] = useState(0)
  const [returnTo, setReturnTo] = useState(next ?? ideasPath(lang))
  const [who, setWho] = useState("")

  useEffect(() => {
    const target = next ?? safeReturnPath(lang, new URLSearchParams(window.location.search).get("next"))
    setReturnTo(target)
    const linkToken = takeLinkToken()
    if (!linkToken) return
    setState("verifying")
    ideas
      .startSession(linkToken)
      .then(async ({ returnTo: landing }) => {
        if (isSignInPopup()) {
          setState("popup-done")
          return announceSignIn()
        }
        const signedIn = await ideas.member().catch(() => null)
        setWho(signedIn ? maskEmail(signedIn.email) : "")
        setState("signed-in")
        window.setTimeout(() => router.replace(safeReturnPath(lang, landing ?? target)), landingPauseMs)
      })
      .catch((error) => {
        if (error instanceof IdeasError && error.code === "invalid_token") return setState("expired")
        setFailure(errorText(lang, error, words.failed))
        setState("failed")
      })
  }, [lang, next, router, words.failed])

  // The sign-in page's inline script hid the form before React loaded; React's own state takes over from here.
  useLayoutEffect(() => {
    if (state !== "idle") delete document.documentElement.dataset.signInLink
  }, [state])

  useEffect(() => {
    if (!isSignInPopup()) return
    const error = new URLSearchParams(window.location.search).get("sign_in_error")
    if (error) return announceSignIn(error)
    if (member) {
      setState("popup-done")
      announceSignIn()
    }
  }, [member])

  const fail = (error: unknown) => {
    setFailure(errorText(lang, error, words.failed))
    setState("failed")
  }

  const send = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState("sending")
    try {
      await ideas.requestSignInLink({ email, locale, returnTo, turnstileToken: token })
      setState("sent")
    } catch (error) {
      fail(error)
    }
    setToken("")
    setResetKey((key) => key + 1)
  }

  const google = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const href = event.currentTarget.href
    try {
      await ideas.googleSignInReady(locale, returnTo)
      window.location.assign(href)
    } catch (error) {
      fail(error)
    }
  }

  const Heading = embedded ? "h2" : "h1"

  if (state === "popup-done")
    return (
      <section className="ideas-panel">
        <p role="status">{boardWords(lang).popupDone}</p>
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
        <p>{words.signedIn(maskEmail(member.email))}</p>
        <div className="ideas-actions">
          <Link className="ideas-button" href={returnTo}>
            {words.continue}
          </Link>
          <Link className="ideas-button ideas-button-quiet" href={ideasPath(lang, "account")}>
            {account.link}
          </Link>
        </div>
      </section>
    )

  const linkStatus = state === "verifying" || state === "signed-in"
  return (
    <section
      className="ideas-panel ideas-sign-in"
      data-link-status={linkStatus || undefined}
      aria-labelledby="sign-in-title"
      aria-busy={state === "verifying"}
    >
      <div className="ideas-sign-in-form" inert={linkStatus}>
        <Heading id="sign-in-title">{state === "expired" ? words.expired : words.title}</Heading>
        <p>{state === "expired" ? words.expiredText : words.intro}</p>
        <a className="ideas-button ideas-google" href={ideas.googleSignInUrl(locale, returnTo)} onClick={google}>
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
              {failure}
            </p>
          )}
        </form>
      </div>
      {/* Laid over the form, which keeps its room, so the card and the footer below it do not jump. */}
      <div className="ideas-sign-in-status" role="status">
        {state === "signed-in" ? (
          <>
            <CircleCheck className="ideas-panel-icon ideas-panel-icon-done" aria-hidden="true" />
            {who && <p className="ideas-sign-in-who">{words.signedIn(who)}</p>}
            <p>{words.returning}</p>
          </>
        ) : (
          <>
            <LoaderCircle className="ideas-panel-icon ideas-spin" aria-hidden="true" />
            <p>{words.verifying}</p>
          </>
        )}
      </div>
    </section>
  )
}
