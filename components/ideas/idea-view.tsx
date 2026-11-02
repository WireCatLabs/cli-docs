"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { ideas, ideasPath } from "@/lib/ideas"
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
  const id = useSearchParams().get("id") ?? ""
  const member = useMember()
  const [load, setLoad] = useState<Load>({ state: "loading" })

  const fetchIdea = useCallback(() => {
    setLoad({ state: "loading" })
    let current = true
    ideas
      .get(id)
      .then((idea) => current && setLoad(idea ? { state: "ready", idea } : { state: "missing" }))
      .catch(() => current && setLoad({ state: "down" }))
    return () => {
      current = false
    }
  }, [id])
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
  const answerTitle = idea.status === "not_planned" ? words.whyNot : words.answer
  return (
    <article className="idea-detail" aria-labelledby="idea-title">
      {back}
      <p className="idea-meta">
        <StatusLabel lang={lang} status={idea.status} />
        <span>{words.tools[idea.tool]}</span>
      </p>
      <div className="idea-detail-head">
        <h1 id="idea-title">{idea.title}</h1>
        <VoteButton lang={lang} idea={idea} member={member} wide />
      </div>
      <p className="idea-body">{idea.body}</p>
      <p className="idea-byline">{words.postedBy(idea.author ?? words.team, formatIdeaDate(lang, idea.createdAt))}</p>
      {idea.answer && (
        <section className="idea-answer" data-status={idea.status} aria-labelledby="idea-answer">
          <h2 id="idea-answer">{answerTitle}</h2>
          <p>{idea.answer}</p>
          {idea.links.length > 0 && (
            <>
              <h3>{words.shipped}</h3>
              <ul>
                {idea.links.map((link) => (
                  <li key={link.url}>
                    <a
                      className="animated-text-link text-link"
                      href={link.url.startsWith("/") ? localizedPath(link.url, lang) : link.url}
                    >
                      <span className="link-label">
                        {link.kind === "release" ? words.releasePost : words.pullRequest}: {link.title}
                      </span>
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </article>
  )
}
