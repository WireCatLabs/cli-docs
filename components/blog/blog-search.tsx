"use client"

import { Search, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { blogPath } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"

const normalise = (text: string) => text.toLocaleLowerCase().normalize("NFKD").replace(/\p{M}/gu, "")

/**
 * Filters the index's `.blog-list` in place: every item carries its searchable text in `data-search`, so the
 * list stays server-rendered and the search needs no index file. `?q=` from the post sidebar fills it in.
 */
export function BlogListSearch({ lang, total }: { lang: string; total: number }) {
  const words = blogWords(lang)
  const [query, setQuery] = useState("")
  const [shown, setShown] = useState(total)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q")
    if (initial) setQuery(initial)
    const focus = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (event.key === "/" && !target.closest("input, textarea, [contenteditable]")) {
        event.preventDefault()
        input.current?.focus()
      }
    }
    document.addEventListener("keydown", focus)
    return () => document.removeEventListener("keydown", focus)
  }, [])

  useEffect(() => {
    const terms = normalise(query).split(/\s+/).filter(Boolean)
    const items = document.querySelectorAll<HTMLElement>(".blog-list > li[data-search]")
    let count = 0
    for (const item of items) {
      const text = normalise(item.dataset.search ?? "")
      const match = terms.every((term) => text.includes(term))
      item.hidden = !match
      if (match) count++
    }
    document.querySelector(".blog-index")?.toggleAttribute("data-searching", terms.length > 0)
    setShown(count)
  }, [query])

  return (
    <search className="blog-search">
      <label>
        <Search aria-hidden="true" />
        <span className="sr-only">{words.search}</span>
        <input
          ref={input}
          type="search"
          value={query}
          placeholder={words.searchPlaceholder}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} aria-label={words.clear}>
            <X aria-hidden="true" />
          </button>
        ) : (
          <kbd>/</kbd>
        )}
      </label>
      <p className="blog-search-count" aria-live="polite">
        {shown ? words.results(shown, total) : words.noResults}
      </p>
    </search>
  )
}

/** The sidebar search on a post: a plain form that opens the index with `?q=`. */
export function BlogSearchForm({ lang }: { lang: string }) {
  const words = blogWords(lang)
  return (
    <search className="blog-search">
      <form action={blogPath(lang)} method="get">
        <label>
          <Search aria-hidden="true" />
          <span className="sr-only">{words.search}</span>
          <input type="search" name="q" placeholder={words.searchPlaceholder} />
        </label>
      </form>
    </search>
  )
}
