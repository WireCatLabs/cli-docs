"use client"

import { ArrowRight, Plus, Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { boardSorts } from "@/lib/ideas/board/types"
import { boardWords } from "@/lib/ideas/board/words"
import { ideaStatuses, ideaTools } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
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
import { smoothly, useComposer, useIdeasBoard } from "./use-board"
import { WhereNote } from "./where-note"

/** Search first: the one box searches the list, and the same words become the title of a new idea. */
export function VariantA({ lang }: { lang: string }) {
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
    smoothly(() => {
      composer.setTitle(board.search.trim())
      board.setSearch("")
      setComposing(true)
    })
    ask.current?.focus()
  }
  const stopPost = () => {
    smoothly(() => {
      setComposing(false)
      composer.reset()
    })
    board.signIn.cancel()
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault()
        ask.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const typed = board.search.trim()
  const showSignIn = !!board.signIn.reason

  return (
    <div className="board board-a">
      <header className="a-head">
        <h1>{ideas.title}</h1>
        <p>{words.intro}</p>
      </header>

      <div className="a-ask" data-composing={composing || undefined}>
        <div className="a-ask-box">
          {composing ? <Plus aria-hidden="true" /> : <Search aria-hidden="true" />}
          <label className="sr-only" htmlFor="a-ask">
            {composing ? ideas.form.titleLabel : words.search}
          </label>
          <input
            id="a-ask"
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
            <button type="button" className="a-ask-close" onClick={stopPost} aria-label={words.cancel}>
              <X aria-hidden="true" />
            </button>
          ) : (
            <button type="button" className="board-button board-button-primary" onClick={startPost}>
              {words.newIdea}
            </button>
          )}
        </div>
        {composing && (
          <div className="a-compose">
            {composer.titleError && <p className="board-error">{composer.titleError}</p>}
            <Similar board={board} composer={composer} />
            <ComposerFields board={board} composer={composer} titleField={false} similar={false} />
            {board.signIn.reason === "post" && <SignInBox board={board} compact />}
            <ComposerSubmit board={board} composer={composer} onCancel={stopPost} />
          </div>
        )}
      </div>

      {showSignIn && board.signIn.reason !== "post" && (
        <div className="a-signin">
          <SignInBox board={board} compact />
          <button type="button" className="a-ask-close" onClick={board.signIn.cancel} aria-label={words.close}>
            <X aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="a-bar">
        <nav className="a-sorts" aria-label={ideas.sort}>
          {boardSorts.map((sort) => (
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
        <div className="a-filters">
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
            options={board.tags.map((tag) => ({ value: tag.slug, label: `#${tag.name}` }))}
            onChange={(tag) => board.setQuery({ tag })}
          />
        </div>
      </div>

      <div className="a-count">
        <span aria-live="polite">{board.list ? words.found(board.list.total) : " "}</span>
        {board.filtered && (
          <button type="button" className="board-link-button" onClick={board.clear}>
            {words.clear}
          </button>
        )}
      </div>

      <div className="a-results" aria-busy={board.pending}>
        <Progress board={board} />
        {typed.length > 3 && !composing && (
          <button type="button" className="a-post-this" onClick={startPost}>
            <Plus aria-hidden="true" />
            <span>{words.postThis(typed)}</span>
            <ArrowRight aria-hidden="true" />
          </button>
        )}
        <ListState board={board} onPost={startPost} />
        {board.list && board.list.ideas.length > 0 && (
          <ol className="a-list" data-pending={board.pending || undefined}>
            {board.list.ideas.map((idea) => {
              const open = board.selected === idea.id
              return (
                <li
                  key={idea.id}
                  className="a-row"
                  data-open={open || undefined}
                  style={{ viewTransitionName: `idea-${idea.id}` }}
                >
                  <Vote board={board} idea={idea} />
                  <div className="a-row-text">
                    <h2>
                      <IdeaLink board={board} idea={idea} className="a-row-title">
                        {idea.title}
                      </IdeaLink>
                    </h2>
                    {!open && idea.body && <p className="a-snippet">{idea.body}</p>}
                    {!open && <IdeaMeta board={board} idea={idea} />}
                    {open && (
                      <div className="a-open">
                        <IdeaMeta board={board} idea={idea} tags={false} />
                        <IdeaDetail board={board} id={idea.id} title={false} />
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
      <WhereNote lang={lang} />
    </div>
  )
}
