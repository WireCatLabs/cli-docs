"use client"

import { MailCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { type FormEvent, type MouseEvent, useEffect, useState } from "react"
import { GoogleIcon } from "@/components/brand-icons"
import { ideas, ideasPath, maskEmail, safeReturnPath } from "@/lib/ideas"
import { asLocale, IdeasError } from "@/lib/ideas/types"
import { errorText, ideasWords } from "@/lib/ideas/words"
import { justSignedInKey } from "./member-bar"
import { TurnstileField } from "./turnstile-field"
import { useMember } from "./use-member"

type State = "idle" | "verifying" | "expired" | "sending" | "sent" | "failed" | "deleted"

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
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const target = next ?? safeReturnPath(lang, new URLSearchParams(window.location.search).get("next"))
    setReturnTo(target)
    const linkToken = takeLinkToken()
    if (!linkToken) return
    setState("verifying")
    ideas
      .startSession(linkToken)
      .then(({ returnTo: landing }) => {
        try {
          sessionStorage.setItem(justSignedInKey, "1")
        } catch {}
        router.replace(safeReturnPath(lang, landing ?? target))
      })
      .catch((error) => {
        if (error instanceof IdeasError && error.code === "invalid_token") return setState("expired")
        setFailure(errorText(lang, error, words.failed))
        setState("failed")
      })
  }, [lang, next, router, words.failed])

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

  const deleteAccount = async () => {
    setDeleting(true)
    try {
      await ideas.deleteAccount()
      setState("deleted")
    } catch (error) {
      setFailure(errorText(lang, error, account.failed))
    }
    setDeleting(false)
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

  if (state === "deleted")
    return (
      <section className="ideas-panel" aria-labelledby="account-deleted">
        <Heading id="account-deleted" tabIndex={-1} ref={(heading: HTMLHeadingElement | null) => heading?.focus()}>
          {account.done}
        </Heading>
        <Link className="ideas-button ideas-button-quiet" href={ideasPath(lang)}>
          {words.continue}
        </Link>
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
          <button
            type="button"
            className="ideas-button ideas-button-quiet"
            onClick={() => ideas.signOut().then(() => window.location.reload(), fail)}
          >
            {words.signOut}
          </button>
        </div>
        <div className="ideas-danger">
          {confirming ? (
            <section aria-labelledby="account-confirm">
              <h2 id="account-confirm">{account.confirm}</h2>
              <p>{account.confirmText}</p>
              <div className="ideas-actions">
                <button
                  type="button"
                  className="ideas-button ideas-button-danger"
                  disabled={deleting}
                  onClick={deleteAccount}
                >
                  {deleting ? account.deleting : account.yes}
                </button>
                <button type="button" className="ideas-button ideas-button-quiet" onClick={() => setConfirming(false)}>
                  {account.no}
                </button>
              </div>
              {failure && (
                <p className="ideas-error" role="alert">
                  {failure}
                </p>
              )}
            </section>
          ) : (
            <button type="button" className="ideas-text-button" onClick={() => setConfirming(true)}>
              {account.delete}
            </button>
          )}
        </div>
      </section>
    )

  return (
    <section className="ideas-panel" aria-labelledby="sign-in-title">
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
    </section>
  )
}
