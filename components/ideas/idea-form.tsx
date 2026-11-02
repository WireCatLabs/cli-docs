"use client"

import { CircleCheck } from "lucide-react"
import Link from "next/link"
import { type FormEvent, useEffect, useState } from "react"
import { ideaPath, ideas, ideasPath } from "@/lib/ideas"
import { type Idea, IdeasError, type IdeaTool, ideaTools, isTool } from "@/lib/ideas/types"
import { errorText, ideasWords } from "@/lib/ideas/words"
import { IdeasSkeleton } from "./ideas-states"
import { SignInPanel } from "./sign-in-panel"
import { StatusLabel } from "./status-label"
import { TurnstileField } from "./turnstile-field"
import { signInHref, useMember } from "./use-member"
import { VoteButton } from "./vote-button"

const minTitle = 5

export function IdeaForm({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  const form = words.form
  const member = useMember()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tool, setTool] = useState<IdeaTool | "">("")
  const [similar, setSimilar] = useState<Idea[]>([])
  const [token, setToken] = useState("")
  const [resetKey, setResetKey] = useState(0)
  const [checked, setChecked] = useState(false)
  const [state, setState] = useState<"idle" | "sending" | "failed">("idle")
  const [failure, setFailure] = useState({ text: "", signIn: false })
  const [posted, setPosted] = useState<Idea>()

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("tool")
    if (isTool(preset)) setTool(preset)
  }, [])

  useEffect(() => {
    if (title.trim().length < 4) return setSimilar([])
    let current = true
    const timer = setTimeout(() => {
      ideas
        .similar(title)
        .then((found) => current && setSimilar(found))
        .catch(() => current && setSimilar([]))
    }, 250)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [title])

  if (member === undefined) return <IdeasSkeleton lang={lang} rows={2} />
  if (!member)
    return (
      <>
        <p className="ideas-standfirst">{form.signedOut}</p>
        <SignInPanel lang={lang} next={ideasPath(lang, "new")} embedded />
      </>
    )

  if (posted)
    return (
      <section className="ideas-panel" aria-labelledby="idea-posted">
        <CircleCheck className="ideas-panel-icon ideas-panel-icon-done" aria-hidden="true" />
        <h2 id="idea-posted" tabIndex={-1} ref={(heading) => heading?.focus()}>
          {form.done}
        </h2>
        <p role="status">{form.doneText}</p>
        <div className="ideas-actions">
          <Link className="ideas-button" href={ideaPath(lang, posted.id)}>
            {form.open}
          </Link>
          <button
            type="button"
            className="ideas-button ideas-button-quiet"
            onClick={() => {
              setPosted(undefined)
              setTitle("")
              setBody("")
              setChecked(false)
            }}
          >
            {form.another}
          </button>
        </div>
      </section>
    )

  const titleError = checked && title.trim().length < minTitle ? form.tooShort : ""
  const toolError = checked && !tool ? form.noTool : ""

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setChecked(true)
    if (title.trim().length < minTitle || !tool) return
    setState("sending")
    try {
      setPosted(await ideas.create({ title: title.trim(), body: body.trim(), tool, turnstileToken: token }))
      setState("idle")
    } catch (error) {
      setState("failed")
      setFailure({
        text: errorText(lang, error, form.failed),
        signIn: error instanceof IdeasError && error.code === "sign_in_required",
      })
    }
    setToken("")
    setResetKey((key) => key + 1)
  }

  return (
    <form className="ideas-form ideas-post" onSubmit={submit} noValidate>
      <label htmlFor="idea-title">{form.titleLabel}</label>
      <p id="idea-title-hint" className="ideas-hint">
        {form.titleHint}
      </p>
      <input
        id="idea-title"
        value={title}
        maxLength={120}
        autoComplete="off"
        aria-describedby={titleError ? "idea-title-hint idea-title-error" : "idea-title-hint"}
        aria-invalid={!!titleError}
        onChange={(event) => setTitle(event.target.value)}
      />
      {titleError && (
        <p id="idea-title-error" className="ideas-error">
          {titleError}
        </p>
      )}
      <div className="ideas-similar" aria-live="polite">
        {similar.length > 0 && (
          <>
            <h2>{form.similar}</h2>
            <ul>
              {similar.map((idea) => (
                <li key={idea.id}>
                  <VoteButton lang={lang} idea={idea} member={member} />
                  <span>
                    <Link href={ideaPath(lang, idea.id)}>{idea.title}</Link>
                    <span className="idea-meta">
                      <StatusLabel lang={lang} status={idea.status} />
                      <span>{words.tools[idea.tool]}</span>
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <label htmlFor="idea-body">{form.bodyLabel}</label>
      <p id="idea-body-hint" className="ideas-hint">
        {form.bodyHint}
      </p>
      <textarea
        id="idea-body"
        rows={5}
        maxLength={5000}
        aria-describedby="idea-body-hint"
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />

      <label htmlFor="idea-tool">{form.toolLabel}</label>
      <select
        id="idea-tool"
        value={tool}
        aria-invalid={!!toolError}
        aria-describedby={toolError ? "idea-tool-error" : undefined}
        onChange={(event) => setTool(event.target.value as IdeaTool)}
      >
        <option value="" disabled>
          {form.toolPick}
        </option>
        {ideaTools.map((option) => (
          <option key={option} value={option}>
            {words.tools[option]}
          </option>
        ))}
      </select>
      {toolError && (
        <p id="idea-tool-error" className="ideas-error">
          {toolError}
        </p>
      )}

      <TurnstileField lang={lang} onToken={setToken} resetKey={resetKey} />
      <button type="submit" className="ideas-button" disabled={state === "sending" || !token}>
        {state === "sending" ? form.sending : form.submit}
      </button>
      {state === "failed" && (
        <p className="ideas-error" role="alert">
          {failure.text}{" "}
          {failure.signIn && <Link href={signInHref(lang, ideasPath(lang, "new"))}>{words.signIn.title}</Link>}
        </p>
      )}
    </form>
  )
}
