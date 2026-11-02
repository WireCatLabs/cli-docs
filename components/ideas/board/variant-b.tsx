"use client"

import { ArrowRight, ListFilter, Plus, Search, X } from "lucide-react"
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { type BoardIdea, boardSorts } from "@/lib/ideas/board/types"
import { boardWords } from "@/lib/ideas/board/words"
import { type IdeaStatus, ideaStatuses, ideaTools } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import { StatusIcon } from "../status-label"
import {
  ComposerFields,
  ComposerSubmit,
  IdeaDetail,
  IdeaLink,
  IdeaMeta,
  ListState,
  Progress,
  SignInBox,
  Vote,
} from "./parts"
import { type Board, useComposer, useIdeasBoard } from "./use-board"
import { WhereNote } from "./where-note"

function Dialog({
  open,
  onClose,
  label,
  closeLabel,
  className = "",
  children,
}: {
  closeLabel: string
  open: boolean
  onClose: () => void
  label: string
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      dialog.querySelector<HTMLElement>(".b-dialog-inner")?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])
  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: A click on the backdrop closes it, and the dialog closes on Escape by itself.
    <dialog
      ref={ref}
      className={`b-dialog ${className}`}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="b-dialog-inner" tabIndex={-1}>
        <button type="button" className="b-dialog-close" onClick={onClose} aria-label={closeLabel}>
          <X aria-hidden="true" />
        </button>
        {open && children}
      </div>
    </dialog>
  )
}

const lanes: IdeaStatus[] = ["in_progress", "planned", "done"]

function Roadmap({ board, all }: { board: Board; all: BoardIdea[] }) {
  const words = boardWords(board.lang)
  return (
    <section className="b-roadmap" aria-label={words.roadmap.planned}>
      {lanes.map((status) => {
        const ideas = all.filter((idea) => idea.status === status)
        return (
          <div key={status} className="b-lane" data-status={status}>
            <h2>
              <StatusIcon status={status} />
              {words.roadmap[status as keyof typeof words.roadmap]}
              <span className="b-lane-count">{ideas.length}</span>
            </h2>
            <ul>
              {ideas.slice(0, 3).map((idea) => (
                <li key={idea.id}>
                  <IdeaLink board={board} idea={board.view(idea)}>
                    {idea.title}
                  </IdeaLink>
                  <span className="b-lane-votes">{board.view(idea).votes}</span>
                </li>
              ))}
            </ul>
            {ideas.length > 0 && (
              <button
                type="button"
                className="board-link-button"
                onClick={() => board.setQuery({ status: board.query.status === status ? undefined : status })}
              >
                {words.seeAll(ideas.length)}
                <ArrowRight aria-hidden="true" />
              </button>
            )}
          </div>
        )
      })}
    </section>
  )
}

function Rail({ board, counts }: { board: Board; counts: Record<string, number> }) {
  const words = boardWords(board.lang)
  const ideas = ideasWords(board.lang)
  const option = (pressed: boolean, onClick: () => void, label: ReactNode, count?: number, key?: string) => (
    <li key={key}>
      <button type="button" aria-pressed={pressed} onClick={onClick}>
        <span>{label}</span>
        {count !== undefined && <span className="b-rail-count">{count}</span>}
      </button>
    </li>
  )
  return (
    <div className="b-rail-inner">
      <label className="b-search">
        <Search aria-hidden="true" />
        <span className="sr-only">{words.search}</span>
        <input
          type="search"
          placeholder={words.search}
          value={board.search}
          onChange={(event) => board.setSearch(event.target.value)}
        />
      </label>
      <div className="b-rail-group">
        <h3>{ideas.sort}</h3>
        <div className="b-segmented">
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
      </div>
      <div className="b-rail-group">
        <h3>{ideas.status}</h3>
        <ul>
          {option(!board.query.status, () => board.setQuery({ status: undefined }), ideas.anyStatus)}
          {ideaStatuses.map((status) =>
            option(
              board.query.status === status,
              () => board.setQuery({ status: board.query.status === status ? undefined : status }),
              <>
                <StatusIcon status={status} />
                {ideas.statuses[status]}
              </>,
              counts[`status:${status}`] ?? 0,
              status,
            ),
          )}
        </ul>
      </div>
      <div className="b-rail-group">
        <h3>{ideas.tool}</h3>
        <ul>
          {option(!board.query.tool, () => board.setQuery({ tool: undefined }), ideas.allTools)}
          {ideaTools.map((tool) =>
            option(
              board.query.tool === tool,
              () => board.setQuery({ tool: board.query.tool === tool ? undefined : tool }),
              ideas.tools[tool],
              counts[`tool:${tool}`] ?? 0,
              tool,
            ),
          )}
        </ul>
      </div>
      <div className="b-rail-group">
        <h3>{words.tags}</h3>
        <div className="b-tag-cloud">
          {board.tags.map((tag) => (
            <button
              key={tag.slug}
              type="button"
              className="board-tag"
              aria-pressed={board.query.tag === tag.slug}
              onClick={() => board.setQuery({ tag: board.query.tag === tag.slug ? undefined : tag.slug })}
            >
              #{tag.name}
              <span className="b-rail-count">{counts[`tag:${tag.slug}`] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Roadmap first: what is being built sits on top, the full list with a filter rail below, dialogs for the rest. */
export function VariantB({ lang }: { lang: string }) {
  const board = useIdeasBoard(lang)
  const words = boardWords(lang)
  const ideas = ideasWords(lang)
  const [all, setAll] = useState<BoardIdea[]>([])
  const [composing, setComposing] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const composer = useComposer(board, (idea) => {
    setComposing(false)
    board.addPosted(idea)
    board.select(idea.id)
  })

  const { source } = board
  useEffect(() => {
    source.list({ sort: "top" }).then(
      ({ ideas: found }) => setAll(found),
      () => setAll([]),
    )
  }, [source])

  const counts = useMemo(() => {
    const result: Record<string, number> = {}
    for (const idea of all) {
      for (const key of [`status:${idea.status}`, `tool:${idea.tool}`, ...idea.tags.map((tag) => `tag:${tag.slug}`)])
        result[key] = (result[key] ?? 0) + 1
    }
    return result
  }, [all])

  const active = [
    board.query.status && { key: "status", label: ideas.statuses[board.query.status] },
    board.query.tool && { key: "tool", label: ideas.tools[board.query.tool] },
    board.query.tag && {
      key: "tag",
      label: `#${board.tags.find((tag) => tag.slug === board.query.tag)?.name ?? board.query.tag}`,
    },
    board.query.q && { key: "q", label: `“${board.query.q}”` },
  ].filter(Boolean) as { key: "status" | "tool" | "tag" | "q"; label: string }[]

  const openIdea = board.selected
  return (
    <div className="board board-b">
      <header className="b-head">
        <div>
          <h1>{ideas.title}</h1>
          <p>{words.intro}</p>
        </div>
        <button type="button" className="board-button board-button-primary" onClick={() => setComposing(true)}>
          <Plus aria-hidden="true" />
          {ideas.post}
        </button>
      </header>

      <Roadmap board={board} all={all} />

      <div className="b-body">
        <aside className="b-rail" aria-label={words.filters}>
          <Rail board={board} counts={counts} />
          <WhereNote lang={lang} />
        </aside>
        <section className="b-main" aria-label={ideas.title}>
          <div className="b-main-head">
            <p aria-live="polite">{board.list ? words.found(board.list.total) : " "}</p>
            <ul className="b-active">
              {active.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => (item.key === "q" ? board.setSearch("") : board.setQuery({ [item.key]: undefined }))}
                  >
                    {item.label}
                    <X aria-label={words.clear} />
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="board-button b-filters-button" onClick={() => setFiltersOpen(true)}>
              <ListFilter aria-hidden="true" />
              {words.filters}
              {active.length > 0 && <span className="b-rail-count">{active.length}</span>}
            </button>
          </div>
          <div className="b-results" aria-busy={board.pending}>
            <Progress board={board} />
            <ListState board={board} onPost={() => setComposing(true)} />
            {board.list && board.list.ideas.length > 0 && (
              <ol className="b-list" data-pending={board.pending || undefined}>
                {board.list.ideas.map((idea) => (
                  <li key={idea.id} className="b-row" style={{ viewTransitionName: `idea-${idea.id}` }}>
                    <div className="b-row-text">
                      <h3>
                        <IdeaLink board={board} idea={idea} className="b-row-title">
                          {idea.title}
                        </IdeaLink>
                      </h3>
                      {idea.body && <p>{idea.body}</p>}
                      <IdeaMeta board={board} idea={idea} />
                    </div>
                    <Vote board={board} idea={idea} className="board-vote-box" />
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      </div>

      <Dialog
        closeLabel={words.close}
        open={!!openIdea}
        onClose={() => board.select(null)}
        label={ideas.title}
        className="b-dialog-idea"
      >
        {openIdea && <IdeaDetail board={board} id={openIdea} />}
      </Dialog>

      <Dialog
        closeLabel={words.close}
        open={composing}
        onClose={() => {
          setComposing(false)
          board.signIn.reason === "post" && board.signIn.cancel()
        }}
        label={words.composeTitle}
        className="b-dialog-compose"
      >
        <h2 className="b-dialog-title">{words.composeTitle}</h2>
        <p className="board-quiet">{words.composeIntro}</p>
        <form className="b-compose" onSubmit={(event) => event.preventDefault()}>
          <ComposerFields board={board} composer={composer} />
          {board.signIn.reason === "post" && <SignInBox board={board} compact />}
          <ComposerSubmit board={board} composer={composer} onCancel={() => setComposing(false)} />
        </form>
      </Dialog>

      <Dialog
        closeLabel={words.close}
        open={!!board.signIn.reason && board.signIn.reason !== "post"}
        onClose={board.signIn.cancel}
        label={words.signInTitle}
        className="b-dialog-signin"
      >
        <SignInBox board={board} />
      </Dialog>

      <Dialog
        closeLabel={words.close}
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        label={words.filters}
        className="b-dialog-sheet"
      >
        <h2 className="b-dialog-title">{words.filters}</h2>
        <Rail board={board} counts={counts} />
        <button
          type="button"
          className="board-button board-button-primary b-sheet-done"
          onClick={() => setFiltersOpen(false)}
        >
          {board.list ? words.found(board.list.total) : words.close}
        </button>
      </Dialog>
    </div>
  )
}
