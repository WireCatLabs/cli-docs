"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { ideaPath, ideas, ideasPath } from "@/lib/ideas"
import type { Idea } from "@/lib/ideas/types"
import { formatIdeaDate, ideasWords } from "@/lib/ideas/words"
import { localizedPath } from "@/lib/site-routes"
import { IdeasDown, IdeasSkeleton } from "./ideas-states"
import { StatusLabel } from "./status-label"
import { useMember } from "./use-member"
import { VoteButton } from "./vote-button"

type Load = { state: "loading" } | { state: "down" } | { state: "missing" } | { state: "ready"; idea: Idea }

export function IdeaView({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  const params = useSearchParams()
  const id = params.get("id") ?? ""
  const merged = params.has("merged")
  const router = useRouter()
  const member = useMember()
  const [load, setLoad] = useState<Load>({ state: "loading" })

  const fetchIdea = useCallback(() => {
    setLoad({ state: "loading" })
    let current = true
    ideas
      .get(id)
      .then((idea) => {
        if (!current) return
        // A merged duplicate still answers, so old links in emails forward to the idea that kept its votes.
        if (idea?.mergedIntoId) return router.replace(`${ideaPath(lang, idea.mergedIntoId)}&merged=1`)
        setLoad(idea ? { state: "ready", idea } : { state: "missing" })
      })
      .catch(() => current && setLoad({ state: "down" }))
    return () => {
      current = false
    }
  }, [id, lang, router])
  useEffect(fetchIdea, [fetchIdea])

  useEffect(() => {
    if (load.state === "ready") document.title = `${load.idea.title} · ${words.title} · WireCat`
  }, [load, words.title])

  const back = (
    <Link className="ideas-back animated-text-link" href={ideasPath(lang)}>
      <ArrowLeft aria-hidden="true" />
      <span className="link-label">{words.back}</span>
    </Link>
  )

  if (load.state === "loading")
    return (
      <>
        {back}
        <IdeasSkeleton lang={lang} rows={1} />
      </>
    )
  if (load.state === "down")
    return (
      <>
        {back}
        <IdeasDown lang={lang} onRetry={fetchIdea} />
      </>
    )
  if (load.state === "missing")
    return (
      <>
        {back}
        <section className="ideas-notice" aria-labelledby="idea-gone">
          <h1 id="idea-gone">{words.gone}</h1>
          <p>{words.goneText}</p>
        </section>
      </>
    )

  const { idea } = load
  const links = idea.links.length > 0 && (
    <>
      <h3>{words.shipped}</h3>
      <ul>
        {idea.links.map((link) => (
          <li key={link.url}>
            <a
              className="animated-text-link text-link"
              href={link.url.startsWith("/") ? localizedPath(link.url, lang) : link.url}
            >
              <span className="link-label">{link.label}</span>
              <ArrowRight aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
  return (
    <article className="idea-detail" aria-labelledby="idea-title">
      {back}
      {merged && (
        <p className="ideas-note" role="status">
          {words.mergedNote}
        </p>
      )}
      <p className="idea-meta">
        <StatusLabel lang={lang} status={idea.status} />
        <span>{words.tools[idea.tool]}</span>
      </p>
      <div className="idea-detail-head">
        <h1 id="idea-title">{idea.title}</h1>
        <VoteButton lang={lang} idea={idea} member={member} wide />
      </div>
      {idea.body && <p className="idea-body">{idea.body}</p>}
      <p className="idea-byline">
        {words.postedBy(
          idea.author.team ? words.team : (idea.author.name ?? words.aMember),
          formatIdeaDate(lang, idea.createdAt),
        )}
      </p>
      {idea.statusReason && (
        <section className="idea-answer" data-status={idea.status} aria-labelledby="idea-reason">
          <h2 id="idea-reason">{words.whyNot}</h2>
          <p>{idea.statusReason}</p>
        </section>
      )}
      {(idea.answer || links) && (
        <section
          className="idea-answer"
          data-status={idea.status}
          aria-labelledby={idea.answer ? "idea-answer" : undefined}
          aria-label={idea.answer ? undefined : words.shipped}
        >
          {idea.answer && (
            <>
              <h2 id="idea-answer">{words.answer}</h2>
              <p>{idea.answer}</p>
            </>
          )}
          {links}
        </section>
      )}
    </article>
  )
}
