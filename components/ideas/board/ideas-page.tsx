"use client"

import { ArrowRight, ChevronRight, Plus, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { boardWords } from "@/lib/ideas/board-words"
import { ideaSorts, ideaStatuses, ideaTools, tagName } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import { MemberBar } from "../member-bar"
import { Modal } from "./modal"
import { Pager } from "./pager"
import {
  ComposerFields,
  ComposerSubmit,
  FilterSelect,
  IdeaDetail,
  IdeaLink,
  IdeaMeta,
  ListState,
  Progress,
  SignInBox,
  Vote,
} from "./parts"
import { IdeasSidebar } from "./sidebar"
import { useComposer, useIdeasBoard } from "./use-board"

/**
 * The ideas page: a search box with the new-idea button beside it, a paged list, and one idea or the new-idea form
 * at a time in a modal, so the list behind never moves. The sidebar holds the roadmap, tags and where else to go.
 */
export function IdeasPage({ lang }: { lang: string }) {
  const board = useIdeasBoard(lang)
  const words = boardWords(lang)
  const ideas = ideasWords(lang)
  const [composing, setComposing] = useState(false)
  const ask = useRef<HTMLInputElement>(null)
  const composer = useComposer(board, (idea) => {
    setComposing(false)
    board.setSearch("")
    board.addPosted(idea)
    board.select(idea.id)
  })

  // What was typed in the search becomes the title; the search stays, so closing the form loses nothing.
  const startPost = () => {
    if (!composer.title) composer.setTitle(board.search.trim())
    setComposing(true)
  }
  const stopPost = () => {
    setComposing(false)
    if (board.signIn.reason === "post") board.signIn.cancel()
  }

  // `?compose=1` is where the old /ideas/new address now lands.
  useEffect(() => {
    if (board.composeAsked) setComposing(true)
  }, [board.composeAsked])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement
      if (event.key === "/" && !typing) {
        event.preventDefault()
        ask.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const typed = board.search.trim()
  const listed = board.list?.ideas ?? []

  return (
    <div className="blog-columns board">
      <div className="blog-main">
        <header className="ideas-masthead board-masthead">
          <h1>{ideas.title}</h1>
          <MemberBar lang={lang} />
          <p className="blog-standfirst">{words.intro}</p>
        </header>

        <div className="board-ask">
          <div className="board-ask-box">
            <Search aria-hidden="true" />
            <label className="sr-only" htmlFor="board-ask">
              {words.search}
            </label>
            <input
              id="board-ask"
              ref={ask}
              type="search"
              autoComplete="off"
              maxLength={120}
              placeholder={words.ask}
              value={board.search}
              onChange={(event) => board.setSearch(event.target.value)}
            />
          </div>
          <button type="button" className="board-button board-button-primary board-new" onClick={startPost}>
            <Plus aria-hidden="true" />
            {words.newIdea}
          </button>
        </div>

        <Modal open={composing} onClose={stopPost} label={words.composeTitle} closeLabel={words.cancel}>
          <form className="board-compose" onSubmit={(event) => event.preventDefault()}>
            <h2 className="board-modal-title">{words.composeTitle}</h2>
            <p className="board-quiet">{words.composeIntro}</p>
            <ComposerFields board={board} composer={composer} />
            {board.signIn.reason === "post" && <SignInBox board={board} compact />}
            <ComposerSubmit board={board} composer={composer} onCancel={stopPost} />
          </form>
        </Modal>

        <Modal open={!!board.selected} onClose={() => board.select(null)} label={words.idea} closeLabel={words.close}>
          {board.selected && <IdeaDetail board={board} id={board.selected} />}
        </Modal>

        {board.signIn.reason && board.signIn.reason !== "post" && (
          <div className="board-signin-row">
            <SignInBox board={board} compact />
            <button type="button" className="board-ask-close" onClick={board.signIn.cancel} aria-label={words.close}>
              <X aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="board-bar">
          <nav className="board-sorts" aria-label={ideas.sort}>
            {ideaSorts.map((sort) => (
              <button
                key={sort}
                type="button"
                aria-pressed={board.query.sort === sort}
                onClick={() => board.setQuery({ sort })}
              >
                {words.sorts[sort]}
              </button>
            ))}
          </nav>
          <div className="board-filters">
            <FilterSelect
              label={ideas.tool}
              anyLabel={ideas.allTools}
              value={board.query.tool}
              options={ideaTools.map((tool) => ({ value: tool, label: ideas.tools[tool] }))}
              onChange={(tool) => board.setQuery({ tool })}
            />
            <FilterSelect
              label={ideas.status}
              anyLabel={ideas.anyStatus}
              value={board.query.status}
              options={ideaStatuses.map((status) => ({ value: status, label: ideas.statuses[status] }))}
              onChange={(status) => board.setQuery({ status })}
            />
            <FilterSelect
              label={words.tag}
              anyLabel={words.anyTag}
              value={board.query.tag}
              options={board.tags.map((tag) => ({ value: tag.slug, label: `#${tagName(tag, lang)}` }))}
              onChange={(tag) => board.setQuery({ tag })}
            />
          </div>
        </div>

        <div className="board-count">
          <span aria-live="polite">{board.list ? words.found(board.list.total) : " "}</span>
          {board.filtered && (
            <button type="button" className="board-link-button" onClick={board.clear}>
              {words.clear}
            </button>
          )}
        </div>

        {board.merged && (
          <p className="ideas-note" role="status">
            {ideas.mergedNote}
          </p>
        )}

        <div className="board-results" aria-busy={board.pending}>
          <Progress board={board} />
          {typed.length > 3 && (
            <button
              type="button"
              className="board-post-this"
              onClick={() => {
                composer.setTitle(typed)
                setComposing(true)
              }}
            >
              <Plus aria-hidden="true" />
              <span>{words.postThis(typed)}</span>
              <ArrowRight aria-hidden="true" />
            </button>
          )}
          <ListState board={board} onPost={startPost} />
          {listed.length > 0 && (
            <ol className="board-list" data-pending={board.pending || undefined}>
              {listed.map((idea) => (
                <li key={idea.id} className="board-row" data-idea={idea.id}>
                  <Vote board={board} idea={idea} />
                  <div className="board-row-text">
                    <h2>
                      <IdeaLink board={board} idea={idea} className="board-row-title">
                        {idea.title}
                        <ChevronRight className="board-row-arrow" aria-hidden="true" />
                      </IdeaLink>
                    </h2>
                    {idea.body && <p className="board-snippet">{idea.body}</p>}
                    <IdeaMeta board={board} idea={idea} />
                  </div>
                </li>
              ))}
            </ol>
          )}
          <Pager board={board} />
        </div>
      </div>
      <aside className="blog-sidebar ideas-sidebar">
        <IdeasSidebar board={board} />
      </aside>
    </div>
  )
}
