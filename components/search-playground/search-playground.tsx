"use client"

import "@/lib/landing/search-playground.css"
import { Popover } from "@base-ui/react/popover"
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Copy,
  FileText,
  MessageSquare,
  Search,
  Sparkles,
  X,
} from "lucide-react"
import { type KeyboardEvent, useEffect, useId, useMemo, useRef, useState } from "react"
import { normalize } from "@/lib/search-language.generated.js"
import { copy } from "@/lib/search-playground/copy"
import { demoDates } from "@/lib/search-playground/dates"
import {
  filterClauses,
  type Hit,
  highlightWords,
  initialQuery,
  locator,
  messages,
  queryErrorDetails,
  replaceFilter,
  type Suggestion,
  searchDemo,
  suggestionsFor,
} from "@/lib/search-playground/engine"

function Excerpt({ text, words }: { text: string; words: Set<string> }) {
  const parts = [...text.matchAll(/[^\p{L}\p{N}]+|[\p{L}\p{N}]+/gu)]
  return (
    <>
      {parts.map((part) =>
        words.has(normalize(part[0])) ? (
          <mark key={part.index}>{part[0]}</mark>
        ) : (
          <span key={part.index}>{part[0]}</span>
        ),
      )}
    </>
  )
}

type View = "matches" | "all"
type Detail = "context" | "summary"
export function SearchPlayground({ lang, embedded = false }: { lang: string; embedded?: boolean }) {
  const language = lang === "ru" || lang === "es" ? lang : "en"
  const text = copy[language]
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const [query, setQuery] = useState(initialQuery)
  const [suggestionOpen, setSuggestionOpen] = useState(false)
  const [cursor, setCursor] = useState(initialQuery.length)
  const [view, setView] = useState<View>("matches")
  const [detail, setDetail] = useState<Detail | null>(null)
  const [selected, setSelected] = useState("12")
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [tool, setTool] = useState("tg")
  const input = useRef<HTMLTextAreaElement>(null)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const decoration = useRef<HTMLPreElement>(null)
  const [previous, setPrevious] = useState(() => ({ query: initialQuery, hits: searchDemo(initialQuery) }))
  const section = useRef<HTMLElement>(null)
  const id = useId()
  const result = useMemo(() => {
    try {
      return { hits: searchDemo(query), error: null }
    } catch (error) {
      return { hits: [] as Hit[], error: queryErrorDetails(error) }
    }
  }, [query])
  const displayed = result.error ? previous : { query, hits: result.hits }
  const allHits = useMemo(() => searchDemo(""), [])
  const visibleHits = view === "all" ? allHits : displayed.hits
  const clauses = useMemo(() => filterClauses(query), [query])
  const field = (name: string) => clauses.find((clause) => clause.field === name)
  const errorHint = result.error
    ? !result.error.reason
      ? text.sampleError
      : result.error.reason.startsWith("unsupported")
        ? text.unsupported
        : text.invalid
    : null
  const words = useMemo(() => highlightWords(displayed.query), [displayed.query])
  const suggestions = useMemo(() => suggestionsFor(query, cursor), [query, cursor])
  const active =
    visibleHits.find((hit) => hit.message.id === selected) ??
    visibleHits.find((hit) => hit.context.some((message) => message.id === selected)) ??
    visibleHits[0]
  const anchor = active?.context.find((message) => message.id === selected) ?? active?.message
  const evidence = [
    ...new Map(displayed.hits.flatMap((hit) => hit.context).map((message) => [message.id, message])).values(),
  ]
  const facts = [
    {
      id: "12",
      text: text.deadline.replace(
        "{date}",
        new Intl.DateTimeFormat(language, { dateStyle: "long", timeZone: "UTC" }).format(new Date(demoDates.deadline)),
      ),
    },
    { id: "22", text: text.budget },
  ].filter((fact) => evidence.some((message) => message.id === fact.id))
  const command = `${tool} search messages '${(query.trim() || "in:all").replaceAll("'", "'\\''")}' --source all --newest --timezone UTC --context 2 --json`
  const update = (value: string, position = value.length, focus = true) => {
    try {
      setPrevious({ query: value, hits: searchDemo(value) })
    } catch {
      /* Keep the last executable query while editing. */
    }
    setQuery(value)
    setView("matches")
    setDetail(null)
    setHighlightedIndex(-1)
    setSuggestionOpen(value.length > 0 && suggestionsFor(value, position).length > 0)
    setCursor(position)
    setCopied(false)
    setCopyError(false)
    if (focus)
      requestAnimationFrame(() => {
        input.current?.focus()
        input.current?.setSelectionRange(position, position)
      })
  }
  const insertSuggestion = (item: Suggestion) => {
    update(item.value, item.cursor)
    setSuggestionOpen(/(?:text|chat|from|date|has|in):$|\s$/u.test(item.value.slice(0, item.cursor)))
  }
  const navigateSuggestions = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && suggestions.length) {
      event.preventDefault()
      setSuggestionOpen(true)
      const next =
        event.key === "ArrowDown"
          ? (highlightedIndex + 1) % suggestions.length
          : highlightedIndex < 0
            ? suggestions.length - 1
            : (highlightedIndex - 1 + suggestions.length) % suggestions.length
      setHighlightedIndex(next)
      requestAnimationFrame(() =>
        document.getElementById(`${id}-suggestion-${next}`)?.scrollIntoView({ block: "nearest" }),
      )
    } else if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      if (suggestionOpen && suggestions[highlightedIndex]) insertSuggestion(suggestions[highlightedIndex])
      else {
        setView("matches")
        setDetail(null)
        setSuggestionOpen(false)
      }
    } else if (event.key === "Escape" || event.key === "Tab") {
      setSuggestionOpen(false)
      setHighlightedIndex(-1)
      if (event.key === "Escape") input.current?.focus()
    }
  }
  useEffect(() => {
    if (!suggestionOpen) return
    const closeOutside = (event: PointerEvent) => {
      if (!section.current?.contains(event.target as Node)) setSuggestionOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => document.removeEventListener("pointerdown", closeOutside)
  }, [suggestionOpen])
  const pickFilter = (name: string, value?: string) => {
    const existing = field(name)
    if (existing && value === undefined) update(replaceFilter(query, name))
    else {
      update(replaceFilter(query, name, value ?? ""))
      if (value !== undefined) setSuggestionOpen(false)
    }
  }
  useEffect(() => {
    const element = input.current
    if (!element || element.value !== query) return
    element.style.height = "0px"
    element.style.height = `${Math.min(220, element.scrollHeight)}px`
  }, [query])
  const span = result.error?.span
  const errorStart =
    span && span.start < query.length ? Math.min(query.length, span.start) : Math.max(0, query.search(/\S+\s*$/u))
  const errorEnd = span ? Math.min(query.length, Math.max(span.end, span.start + 1)) : query.length
  const date = (value: string) =>
    new Intl.DateTimeFormat(language, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(value))
  const source = (messageId: string) => {
    setSelected(messageId)
    setDetail("context")
  }
  if (!ready)
    return (
      <div className={embedded ? "sp-docs-host" : "sp-host"}>
        <section
          className={`search-playground${embedded ? " sp-embedded" : ""}`}
          id="search-playground"
          aria-busy="true"
          aria-label={text.title}
        >
          <div className="sp-heading">
            <h2>{text.title}</h2>
            <p>{text.intro}</p>
          </div>
        </section>
      </div>
    )
  return (
    <div className={embedded ? "sp-docs-host" : "sp-host"}>
      <section
        ref={section}
        className={`search-playground${embedded ? " sp-embedded" : ""}`}
        id="search-playground"
        aria-labelledby={`${id}-title`}
      >
        <div className="sp-heading">
          <span className="sp-eyebrow">
            <Sparkles size={14} aria-hidden />
            {text.eyebrow}
          </span>
          <h2 id={`${id}-title`} className={embedded ? undefined : "big"}>
            {text.title}
          </h2>
          <p>{text.intro}</p>
        </div>
        <div className="sp-workspace" aria-busy={!ready}>
          <div className="sp-editor">
            <div className="sp-topline">
              <span>
                <span className="sp-dot" />
                {text.archive}
              </span>
              <Popover.Root>
                <Popover.Trigger className="sp-help-trigger" aria-label={text.advanced}>
                  <CircleHelp size={15} aria-hidden />
                  {text.advanced}
                </Popover.Trigger>
                <Popover.Portal container={section}>
                  <Popover.Positioner sideOffset={8} align="end">
                    <Popover.Popup className="sp-help-content" initialFocus={false}>
                      <p>{text.syntaxHelp}</p>
                      <code>AND · OR · NOT · chat: · from: · date: · has: · in: · text:</code>
                      <a href="https://github.com/WireCatLabs/cli-messaging/blob/main/docs/search/query-language.md">
                        {text.reference} ↗
                      </a>
                    </Popover.Popup>
                  </Popover.Positioner>
                </Popover.Portal>
              </Popover.Root>
            </div>
            <div className="sp-autocomplete-box">
              <label htmlFor={`${id}-input`} className="sp-label">
                {text.label}
              </label>
              <div className={`sp-input-wrap${result.error?.reason ? " sp-invalid" : ""}`}>
                <Search size={20} aria-hidden />
                <div className="sp-query-field">
                  <pre ref={decoration} className="sp-query-decoration" aria-hidden="true">
                    {result.error ? (
                      <>
                        {query.slice(0, errorStart)}
                        <mark className="sp-query-error">{query.slice(errorStart, errorEnd) || " "}</mark>
                        {query.slice(errorEnd)}
                      </>
                    ) : (
                      query
                    )}
                    {"\n"}
                  </pre>
                  <textarea
                    rows={1}
                    value={query}
                    aria-autocomplete="list"
                    aria-activedescendant={
                      suggestionOpen && highlightedIndex >= 0 ? `${id}-suggestion-${highlightedIndex}` : undefined
                    }
                    onChange={(event) => update(event.currentTarget.value, event.currentTarget.selectionStart, false)}
                    role="combobox"
                    ref={input}
                    readOnly={!ready}
                    id={`${id}-input`}
                    className="sp-input"
                    placeholder={text.placeholder}
                    aria-expanded={suggestionOpen && suggestions.length > 0}
                    aria-controls={suggestionOpen && suggestions.length > 0 ? `${id}-suggestions` : undefined}
                    aria-invalid={!!result.error}
                    aria-describedby={`${id}-hint`}
                    spellCheck={false}
                    autoComplete="off"
                    onKeyDown={navigateSuggestions}
                    onSelect={(event) => {
                      const position = event.currentTarget.selectionStart ?? query.length
                      setCursor(position)
                    }}
                    onScroll={(event) => {
                      if (decoration.current) decoration.current.scrollTop = event.currentTarget.scrollTop
                    }}
                  />
                </div>
                {query && (
                  <button
                    type="button"
                    className="sp-clear"
                    aria-label={text.clear}
                    onClick={() => {
                      update("")
                      setView("matches")
                    }}
                  >
                    <X size={16} aria-hidden />
                  </button>
                )}
                <button
                  type="button"
                  className="sp-trigger"
                  aria-label={text.suggestionsTitle}
                  aria-expanded={suggestionOpen && suggestions.length > 0}
                  aria-controls={suggestionOpen && suggestions.length > 0 ? `${id}-suggestions` : undefined}
                  onClick={() => {
                    setCursor(input.current?.selectionStart ?? query.length)
                    setSuggestionOpen(!suggestionOpen)
                    input.current?.focus()
                  }}
                >
                  <ArrowDown size={16} aria-hidden />
                </button>
              </div>
              {suggestionOpen && suggestions.length > 0 && (
                <div className="sp-positioner">
                  <div className="sp-popup">
                    <div className="sp-popup-label">{text.suggestionsTitle}</div>
                    <div
                      id={`${id}-suggestions`}
                      role="listbox"
                      aria-label={text.suggestionsTitle}
                      tabIndex={0}
                      onKeyDown={navigateSuggestions}
                    >
                      {suggestions.map((item, index) => (
                        <button
                          type="button"
                          role="option"
                          tabIndex={-1}
                          id={`${id}-suggestion-${index}`}
                          aria-selected={highlightedIndex === index}
                          data-highlighted={highlightedIndex === index ? "" : undefined}
                          className="sp-suggestion"
                          key={item.value}
                          onPointerMove={() => setHighlightedIndex(index)}
                          onClick={() => insertSuggestion(item)}
                        >
                          <span>
                            {item.labelKey
                              ? (text.suggestions[item.labelKey as keyof typeof text.suggestions] ?? item.label)
                              : item.label}
                          </span>
                          <small>{item.detail}</small>
                          <ChevronRight size={14} aria-hidden />
                        </button>
                      ))}
                    </div>
                    <div className="sp-popup-footer">{text.keyboard}</div>
                  </div>
                </div>
              )}
            </div>
            <p id={`${id}-hint`} className="sp-hint" role="status">
              {result.error ? `${errorHint} ${text.previous}` : text.hint}
            </p>
            <div className="sp-filters">
              {(["text", "chat", "from"] as const).map((name) => (
                <button type="button" key={name} aria-pressed={!!field(name)} onClick={() => pickFilter(name)}>
                  {text.filters[name]}
                  <span>{field(name) ? "×" : "+"}</span>
                </button>
              ))}
              <div className={`sp-date${field("date") ? " sp-filter-active" : ""}`}>
                <button
                  type="button"
                  className="sp-date-presets"
                  aria-pressed={!!field("date")}
                  onClick={() => {
                    const clause = field("date")
                    if (clause) {
                      setCursor(clause.end)
                      setSuggestionOpen(true)
                      input.current?.focus()
                      input.current?.setSelectionRange(clause.end, clause.end)
                    } else update(replaceFilter(query, "date", ""))
                  }}
                >
                  {text.date}
                </button>
                <input
                  aria-label={text.date}
                  type="date"
                  value={/^\d{4}-\d{2}-\d{2}$/u.test(field("date")?.value ?? "") ? field("date")?.value : ""}
                  onChange={(event) => {
                    update(replaceFilter(query, "date", event.target.value || undefined))
                    setSuggestionOpen(false)
                  }}
                />
                {field("date") && (
                  <button
                    type="button"
                    className="sp-remove-date"
                    aria-label={text.clearDate}
                    onClick={() => update(replaceFilter(query, "date"))}
                  >
                    <X size={13} aria-hidden />
                  </button>
                )}
              </div>
              <button
                type="button"
                aria-pressed={field("has")?.value.toLowerCase() === "file"}
                onClick={() => pickFilter("has", field("has")?.value.toLowerCase() === "file" ? undefined : "file")}
              >
                <FileText size={13} aria-hidden />
                {text.attachment}
                <span>{field("has")?.value.toLowerCase() === "file" ? "×" : "+"}</span>
              </button>
              <span className="sp-zone">{text.utc}</span>
            </div>
          </div>
          <div className="sp-results-bar">
            <fieldset className="sp-views" aria-label={text.countLabel}>
              {(["matches", "all"] as const).map((tab) => (
                <button
                  type="button"
                  key={tab}
                  aria-pressed={view === tab}
                  onClick={() => {
                    setView(tab)
                    setDetail(null)
                  }}
                >
                  {text[tab]}
                  <span>{tab === "matches" ? displayed.hits.length : allHits.length}</span>
                </button>
              ))}
            </fieldset>
            <span className="sp-results-count" aria-live="polite">
              {text[view]}: {visibleHits.length}
            </span>
          </div>
          {detail && (
            <div className="sp-detail-bar">
              <button type="button" onClick={() => setDetail(null)}>
                <ChevronLeft size={14} aria-hidden />
                {text.backToMessages}
              </button>
              <button type="button" aria-pressed={detail === "context"} onClick={() => setDetail("context")}>
                {text.context}
              </button>
              <button type="button" aria-pressed={detail === "summary"} onClick={() => setDetail("summary")}>
                {text.summary}
              </button>
            </div>
          )}
          <section className="sp-results" aria-label={text.countLabel}>
            {visibleHits.length === 0 ? (
              <div className="sp-empty">
                <Search size={25} aria-hidden />
                <h3>{text.empty}</h3>
                <p>{errorHint ?? text.emptyHelp}</p>
              </div>
            ) : detail === null ? (
              <div className="sp-hit-list">
                {visibleHits.map(({ message }) => (
                  <button type="button" className="sp-hit" key={locator(message)} onClick={() => source(message.id)}>
                    <div className="sp-hit-meta">
                      <span className={`sp-provider sp-${message.provider}`}>
                        {message.provider === "max" ? "MAX" : "Telegram"}
                      </span>
                      <strong>{message.chat}</strong>
                      <time dateTime={message.date}>{date(message.date)}</time>
                    </div>
                    <p>
                      <b>{message.from}</b>
                      <span>
                        <Excerpt text={message.text} words={words} />
                      </span>
                    </p>
                    <span className="sp-read-context">
                      {text.context}
                      <ChevronRight size={14} aria-hidden />
                    </span>
                  </button>
                ))}
              </div>
            ) : detail === "context" && active ? (
              <div className="sp-context">
                <div className="sp-context-title">
                  <MessageSquare size={17} aria-hidden />
                  <strong>{active.message.chat}</strong>
                  <span>{active.message.provider === "max" ? "MAX" : "Telegram"}</span>
                </div>
                <div className="sp-context-picker">
                  {visibleHits.map((hit) => (
                    <button
                      type="button"
                      key={hit.message.id}
                      aria-pressed={hit.message.id === anchor?.id}
                      onClick={() => setSelected(hit.message.id)}
                    >
                      {hit.message.chat} · {hit.message.from}
                    </button>
                  ))}
                </div>
                {active.context.map((message) => (
                  <article className={`sp-message${message.id === anchor?.id ? " sp-anchor" : ""}`} key={message.id}>
                    <header>
                      <b>{message.from}</b>
                      <time dateTime={message.date}>{date(message.date)}</time>
                      {message.id === anchor?.id && <span>{text.quote}</span>}
                    </header>
                    <p>
                      <Excerpt text={message.text} words={words} />
                    </p>
                  </article>
                ))}
                <code className="sp-locator">{locator(anchor ?? active.message)}</code>
              </div>
            ) : (
              <div className="sp-summary">
                <h3>{text.summaryTitle}</h3>
                <p>{text.summaryHint}</p>
                {facts.length === 0 ? (
                  <p>{text.noFacts}</p>
                ) : (
                  facts.map((fact) => {
                    const message = messages.find((message) => message.id === fact.id)
                    if (!message) return null
                    return (
                      <article key={fact.id}>
                        <Check size={17} aria-hidden />
                        <div>
                          <h4>{fact.text}</h4>
                          <blockquote>{message.text}</blockquote>
                          <button type="button" onClick={() => source(fact.id)}>
                            {message.chat} · {message.from} · {date(message.date)}
                            <ArrowUpRight size={13} aria-hidden />
                          </button>
                        </div>
                      </article>
                    )
                  })
                )}
              </div>
            )}
          </section>
          <div className="sp-command">
            <button
              type="button"
              className="sp-tool"
              onClick={() => {
                setTool(tool === "tg" ? "max" : "tg")
                setCopied(false)
                setCopyError(false)
              }}
              aria-label="Telegram / MAX"
            >
              {tool === "tg" ? "Telegram" : "MAX"}
              <ChevronRight size={13} aria-hidden />
            </button>
            <code>{command}</code>
            <button
              type="button"
              className="sp-copy"
              aria-label={copied ? text.copied : text.copy}
              disabled={!!result.error}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(command)
                  setCopied(true)
                  setCopyError(false)
                } catch {
                  setCopied(false)
                  setCopyError(true)
                }
              }}
            >
              {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
              <span>{copied ? text.copied : text.copy}</span>
            </button>
          </div>
          {copyError && (
            <p role="status" className="sp-hint">
              {text.copyFailed}
            </p>
          )}
        </div>
        <div className="sp-footnote">
          <p>{text.scope}</p>
          <div>
            <a href="https://github.com/WireCatLabs/max-cli/blob/main/docs/search.md">
              MAX {text.reference}
              <ArrowUpRight size={13} aria-hidden />
            </a>
            <a href="https://github.com/WireCatLabs/tg-cli/blob/main/docs/search.md">
              Telegram {text.reference}
              <ArrowUpRight size={13} aria-hidden />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
