"use client"

import { ArrowLeft, ChevronUp, MessageSquare, Plus, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { boardSorts } from "@/lib/ideas/board/types"
import { boardWords } from "@/lib/ideas/board/words"
import { ideaStatuses, ideaTools } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import { StatusIcon } from "../status-label"
import {
  ComposerFields,
  ComposerSubmit,
  FilterSelect,
  IdeaDetail,
  IdeaLink,
  ListState,
  Progress,
  SignInBox,
} from "./parts"
import { smoothly, useComposer, useIdeasBoard } from "./use-board"
import { WhereNote } from "./where-note"

function useWide() {
  const [wide, setWide] = useState(true)
  useEffect(() => {
    const query = window.matchMedia("(min-width: 60rem)")
    const update = () => setWide(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return wide
}

/** Split view: the list stays put on the left, the open idea or the new-idea form fills the right. */
export function VariantC({ lang }: { lang: string }) {
  const board = useIdeasBoard(lang)
  const words = boardWords(lang)
  const ideas = ideasWords(lang)
  const [composing, setComposing] = useState(false)
  const wide = useWide()
  const composer = useComposer(board, (idea) => {
    setComposing(false)
    board.addPosted(idea)
    board.select(idea.id)
  })

  const first = board.list?.ideas[0]?.id
  const { selected, select } = board
  useEffect(() => {
    if (!selected && first && wide) select(first)
  }, [selected, first, select, wide])

  const startPost = () => smoothly(() => setComposing(true))
  const closePane = () =>
    smoothly(() => {
      setComposing(false)
      if (!wide) board.select(null)
    })

  const paneOpen = composing || !!board.selected
  const signInHere = board.signIn.reason && board.signIn.reason !== "post"

  return (
    <div className="board board-c" data-pane={paneOpen || undefined}>
      <header className="c-head">
        <div>
          <h1>{ideas.title}</h1>
          <p>{words.intro}</p>
        </div>
        <button type="button" className="board-button board-button-primary" onClick={startPost}>
          <Plus aria-hidden="true" />
          {words.newIdea}
        </button>
      </header>

      <div className="c-split">
        <section className="c-listpane" aria-label={ideas.title}>
          <div className="c-tools">
            <label className="c-search">
              <Search aria-hidden="true" />
              <span className="sr-only">{words.search}</span>
              <input
                type="search"
                placeholder={words.search}
                value={board.search}
                onChange={(event) => board.setSearch(event.target.value)}
              />
            </label>
            <div className="c-filters">
              <div className="c-segmented">
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
              </div>
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
            <p className="c-count" aria-live="polite">
              {board.list ? words.found(board.list.total) : " "}
              {board.filtered && (
                <button type="button" className="board-link-button" onClick={board.clear}>
                  {words.clear}
                </button>
              )}
            </p>
          </div>
          <div className="c-results" aria-busy={board.pending}>
            <Progress board={board} />
            <ListState board={board} onPost={startPost} />
            {board.list && board.list.ideas.length > 0 && (
              <ol className="c-list" data-pending={board.pending || undefined}>
                {board.list.ideas.map((idea) => (
                  <li
                    key={idea.id}
                    className="c-row"
                    aria-current={!composing && board.selected === idea.id ? "true" : undefined}
                    style={{ viewTransitionName: `idea-${idea.id}` }}
                  >
                    <button
                      type="button"
                      className="c-row-vote"
                      aria-pressed={idea.voted}
                      aria-label={`${idea.voted ? ideas.unvote(idea.title) : ideas.vote(idea.title)}, ${idea.votes} ${ideas.votes(idea.votes)}`}
                      onClick={() => board.vote(idea)}
                    >
                      <ChevronUp aria-hidden="true" />
                      {idea.votes}
                    </button>
                    <IdeaLink board={board} idea={idea} className="c-row-link">
                      <span className="c-row-title">{idea.title}</span>
                      <span className="c-row-meta">
                        <span className="c-row-status" data-status={idea.status}>
                          <StatusIcon status={idea.status} />
                          {ideas.statuses[idea.status]}
                        </span>
                        <span>{ideas.tools[idea.tool]}</span>
                        {idea.tags.slice(0, 2).map((tag) => (
                          <span key={tag.slug} className="c-row-tag">
                            #{tag.name}
                          </span>
                        ))}
                        {idea.commentsCount > 0 && (
                          <span className="c-row-comments">
                            <MessageSquare aria-hidden="true" />
                            {idea.commentsCount}
                          </span>
                        )}
                      </span>
                    </IdeaLink>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <WhereNote lang={lang} />
        </section>

        <section className="c-pane" aria-label={composing ? words.composeTitle : ideas.title}>
          <div className="c-pane-bar">
            <button type="button" className="c-pane-back" onClick={closePane}>
              {composing && wide ? <X aria-hidden="true" /> : <ArrowLeft aria-hidden="true" />}
              {composing ? words.cancel : words.back}
            </button>
          </div>
          {signInHere && (
            <div className="c-signin">
              <SignInBox board={board} compact />
              <button type="button" className="c-signin-close" onClick={board.signIn.cancel} aria-label={words.close}>
                <X aria-hidden="true" />
              </button>
            </div>
          )}
          {composing ? (
            <form className="c-compose" onSubmit={(event) => event.preventDefault()}>
              <h2>{words.composeTitle}</h2>
              <p className="board-quiet">{words.composeIntro}</p>
              <ComposerFields board={board} composer={composer} />
              {board.signIn.reason === "post" && <SignInBox board={board} compact />}
              <ComposerSubmit board={board} composer={composer} onCancel={closePane} />
            </form>
          ) : board.selected ? (
            <IdeaDetail key={board.selected} board={board} id={board.selected} />
          ) : (
            <p className="c-pane-empty">{words.select}</p>
          )}
        </section>
      </div>
    </div>
  )
}
