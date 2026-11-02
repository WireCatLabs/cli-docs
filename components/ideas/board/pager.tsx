"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { boardWords } from "@/lib/ideas/board-words"
import type { Board } from "./use-board"

/** 1 … 4 5 6 … 12: the first, the last, and the current page with its neighbours. */
export function pageNumbers(current: number, last: number): (number | "gap")[] {
  const shown = [...new Set([1, current - 1, current, current + 1, last])]
    .filter((page) => page >= 1 && page <= last)
    .sort((a, b) => a - b)
  return shown.flatMap((page, index) => (index > 0 && page - shown[index - 1] > 1 ? ["gap" as const, page] : [page]))
}

export function Pager({ board }: { board: Board }) {
  const words = boardWords(board.lang)
  const current = board.query.page ?? 1
  const last = board.pages
  if (!board.list || last <= 1) return null

  const go = (page: number) => {
    board.setQuery({ page })
    document.querySelector(".board-bar")?.scrollIntoView({ block: "start" })
  }

  return (
    <nav className="board-pager" aria-label={words.pages}>
      <button type="button" disabled={current <= 1} onClick={() => go(current - 1)} aria-label={words.previous}>
        <ChevronLeft aria-hidden="true" />
      </button>
      {pageNumbers(current, last).map((page, index) =>
        page === "gap" ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: A gap has no identity of its own.
          <span key={`gap-${index}`} className="board-pager-gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            aria-current={page === current ? "page" : undefined}
            aria-label={words.page(page)}
            onClick={() => go(page)}
          >
            {page}
          </button>
        ),
      )}
      <button type="button" disabled={current >= last} onClick={() => go(current + 1)} aria-label={words.next}>
        <ChevronRight aria-hidden="true" />
      </button>
    </nav>
  )
}
