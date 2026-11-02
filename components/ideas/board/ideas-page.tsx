"use client"

import { ArrowRight, Plus, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { boardWords } from "@/lib/ideas/board-words"
import { ideaSorts, ideaStatuses, ideaTools, tagName } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import { Collapse } from "./collapse"
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
  Similar,
  Vote,
} from "./parts"
import { IdeasSidebar } from "./sidebar"
import { smoothly, useComposer, useIdeasBoard } from "./use-board"

/**
 * The ideas page: one box searches the list and becomes the new idea's title, ideas open in place on their own
 * panel, and the sidebar holds the roadmap, tags and where else to go.
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

  const startPost = () => {
    // Synchronous, so the next key typed already lands in the title. The form has its own reveal animation.
    composer.setTitle(board.search.trim())
    board.setSearch("")
    setComposing(true)
    ask.current?.focus()
  }
  const stopPost = () => {
    smoothly(() => {
      setComposing(false)
      composer.reset()
    })
    board.signIn.cancel()
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

  // An idea opened by its link scrolls into view once, when the list first arrives; clicks keep the row in place.
  const arrived = useRef(false)
  useEffect(() => {
    if (arrived.current || !board.list) return
    arrived.current = true
    if (board.selected)
      document.querySelector(`[data-idea="${CSS.escape(board.selected)}"]`)?.scrollIntoView({ block: "start" })
  }, [board.selected, board.list])

  const typed = board.search.trim()
  const listed = board.list?.ideas ?? []
  // An idea opened by its link but outside the current filters still opens, above the list.
  const outside = board.selected && board.list && !listed.some((idea) => idea.id === board.selected)

  return (
    <div className="blog-columns board">
      <div className="blog-main">
        <header className="ideas-masthead">
          <div>
            <h1>{ideas.title}</h1>
            <p className="blog-standfirst">{words.intro}</p>
          </div>
        </header>

        <div className="board-ask" data-composing={composing || undefined}>
          <div className="board-ask-box">
            {composing ? <Plus aria-hidden="true" /> : <Search aria-hidden="true" />}
            <label className="sr-only" htmlFor="board-ask">
              {composing ? ideas.form.titleLabel : words.search}
            </label>
            <input
              id="board-ask"
              ref={ask}
              type={composing ? "text" : "search"}
              autoComplete="off"
              maxLength={120}
              placeholder={composing ? ideas.form.titleHint : words.ask}
              value={composing ? composer.title : board.search}
              aria-invalid={composing && !!composer.titleError}
              onChange={(event) =>
                composing ? composer.setTitle(event.target.value) : board.setSearch(event.target.value)
              }
              onKeyDown={(event) => event.key === "Escape" && composing && stopPost()}
            />
            {composing ? (
              <button type="button" className="board-ask-close" onClick={stopPost} aria-label={words.cancel}>
                <X aria-hidden="true" />
              </button>
            ) : (
              <button type="button" className="board-button board-button-primary" onClick={startPost}>
                {words.newIdea}
              </button>
            )}
          </div>
          {composing && (
            <form className="board-compose" onSubmit={(event) => event.preventDefault()}>
              <p className="board-quiet">{words.composeIntro}</p>
              {composer.titleError && <p className="board-error">{composer.titleError}</p>}
              <Similar board={board} composer={composer} />
              <ComposerFields board={board} composer={composer} titleField={false} similar={false} />
              {board.signIn.reason === "post" && <SignInBox board={board} compact />}
              <ComposerSubmit board={board} composer={composer} onCancel={stopPost} />
            </form>
          )}
        </div>

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
          {typed.length > 3 && !composing && (
            <button type="button" className="board-post-this" onClick={startPost}>
              <Plus aria-hidden="true" />
              <span>{words.postThis(typed)}</span>
              <ArrowRight aria-hidden="true" />
            </button>
          )}
          {outside && board.selected && (
            <div className="board-row board-row-alone" data-open="true" data-idea={board.selected}>
              <IdeaDetail board={board} id={board.selected} onClose={() => board.select(null)} />
            </div>
          )}
          <ListState board={board} onPost={startPost} />
          {listed.length > 0 && (
            <ol className="board-list" data-pending={board.pending || undefined}>
              {listed.map((idea) => {
                const open = board.selected === idea.id
                return (
                  <li
                    key={idea.id}
                    className="board-row"
                    data-open={open || undefined}
                    data-idea={idea.id}
                    style={{ viewTransitionName: `idea-${idea.id}` }}
                  >
                    <Vote board={board} idea={idea} />
                    <div className="board-row-text">
                      <h2>
                        <IdeaLink board={board} idea={idea} className="board-row-title">
                          {idea.title}
                        </IdeaLink>
                      </h2>
                      {idea.body && (
                        <Collapse open={!open}>
                          <p className="board-snippet">{idea.body}</p>
                        </Collapse>
                      )}
                      <IdeaMeta board={board} idea={idea} />
                      <Collapse open={open}>
                        <IdeaDetail board={board} id={idea.id} title={false} />
                      </Collapse>
                    </div>
                    {open && (
                      <button
                        type="button"
                        className="board-detail-close"
                        onClick={() => board.select(null)}
                        aria-label={words.close}
                      >
                        <X aria-hidden="true" />
                      </button>
                    )}
                  </li>
                )
              })}
            </ol>
          )}
          {board.list && board.list.total > listed.length && (
            <div className="board-more">
              <button
                type="button"
                className="board-button"
                disabled={board.more === "loading"}
                onClick={board.loadMore}
              >
                {ideas.more(board.list.total - listed.length)}
              </button>
              {board.more === "failed" && (
                <p className="board-error" role="alert">
                  {ideas.down}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <aside className="blog-sidebar ideas-sidebar">
        <IdeasSidebar board={board} />
      </aside>
    </div>
  )
}
