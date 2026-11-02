"use client"

import { MessageSquareText } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { ideaPath, ideas, ideasPath } from "@/lib/ideas"
import { type Idea, type IdeaQuery, ideaSorts, ideaStatuses, ideaTools, isStatus, isTool } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import { IdeasDown, IdeasEmpty, IdeasSkeleton } from "./ideas-states"
import { StatusIcon, StatusLabel } from "./status-label"
import { useMember } from "./use-member"
import { VoteButton } from "./vote-button"

const pageSize = 20

type Load = { state: "loading" } | { state: "down" } | { state: "ready"; ideas: Idea[] }

export function IdeasBoard({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  const params = useSearchParams()
  const tool = isTool(params.get("tool")) ? (params.get("tool") as IdeaQuery["tool"]) : undefined
  const status = isStatus(params.get("status")) ? (params.get("status") as IdeaQuery["status"]) : undefined
  const sort = params.get("sort") === "new" ? "new" : "top"
  const member = useMember()
  const [load, setLoad] = useState<Load>({ state: "loading" })
  const [shown, setShown] = useState(pageSize)

  const fetchIdeas = useCallback(() => {
    setLoad({ state: "loading" })
    setShown(pageSize)
    let current = true
    ideas
      .list({ tool, status, sort })
      .then((list) => current && setLoad({ state: "ready", ideas: list }))
      .catch(() => current && setLoad({ state: "down" }))
    return () => {
      current = false
    }
  }, [tool, status, sort])
  useEffect(fetchIdeas, [fetchIdeas])

  const href = (change: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params)
    next.delete("preview")
    for (const [key, value] of Object.entries(change)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    const query = next.toString()
    return query ? `${ideasPath(lang)}?${query}` : ideasPath(lang)
  }

  return (
    <div className="ideas-board">
      <nav className="ideas-filters" aria-label={words.filters}>
        <div className="ideas-filter-row">
          <span className="ideas-filter-label">{words.tool}</span>
          <ul className="ideas-chips">
            <li>
              <Link href={href({ tool: undefined })} aria-current={!tool ? "page" : undefined} scroll={false}>
                {words.allTools}
              </Link>
            </li>
            {ideaTools.map((option) => (
              <li key={option}>
                <Link href={href({ tool: option })} aria-current={tool === option ? "page" : undefined} scroll={false}>
                  {words.tools[option]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="ideas-filter-row">
          <span className="ideas-filter-label">{words.status}</span>
          <ul className="ideas-chips">
            <li>
              <Link href={href({ status: undefined })} aria-current={!status ? "page" : undefined} scroll={false}>
                {words.anyStatus}
              </Link>
            </li>
            {ideaStatuses.map((option) => (
              <li key={option}>
                <Link
                  href={href({ status: option })}
                  aria-current={status === option ? "page" : undefined}
                  data-status={option}
                  scroll={false}
                >
                  <StatusIcon status={option} />
                  {words.statuses[option]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="ideas-list-head">
        <h2 aria-live="polite">{load.state === "ready" ? words.count(load.ideas.length) : words.title}</h2>
        <nav className="ideas-sort" aria-label={words.sort}>
          {ideaSorts.map((option) => (
            <Link
              key={option}
              href={href({ sort: option === "top" ? undefined : option })}
              aria-current={sort === option ? "page" : undefined}
              scroll={false}
            >
              {option === "top" ? words.top : words.newest}
            </Link>
          ))}
        </nav>
      </div>

      {load.state === "loading" && <IdeasSkeleton lang={lang} />}
      {load.state === "down" && <IdeasDown lang={lang} onRetry={fetchIdeas} />}
      {load.state === "ready" && !load.ideas.length && <IdeasEmpty lang={lang} />}
      {load.state === "ready" && load.ideas.length > 0 && (
        <ol className="ideas-list">
          {load.ideas.slice(0, shown).map((idea) => (
            <li key={idea.id} className="idea-row">
              <VoteButton lang={lang} idea={idea} member={member} />
              <div className="idea-row-text">
                <h3>
                  <Link href={ideaPath(lang, idea.id)}>{idea.title}</Link>
                </h3>
                <p>{idea.body}</p>
                <p className="idea-meta">
                  <StatusLabel lang={lang} status={idea.status} />
                  <span>{words.tools[idea.tool]}</span>
                  {idea.answer && (
                    <span className="idea-has-answer">
                      <MessageSquareText aria-hidden="true" />
                      {words.answer}
                    </span>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {load.state === "ready" && load.ideas.length > shown && (
        <button
          type="button"
          className="ideas-button ideas-button-quiet ideas-more"
          onClick={() => setShown((count) => count + pageSize)}
        >
          {words.more(load.ideas.length - shown)}
        </button>
      )}
    </div>
  )
}
