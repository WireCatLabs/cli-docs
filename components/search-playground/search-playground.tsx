"use client"

import { Autocomplete } from "@base-ui/react/autocomplete"
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronRight,
  Copy,
  FileText,
  MessageSquare,
  Search,
  Sparkles,
} from "lucide-react"
import { useId, useMemo, useRef, useState } from "react"
import { normalize } from "@/lib/search-language.generated.js"
import { copy, examples } from "@/lib/search-playground/copy"
import {
  type Hit,
  highlightWords,
  initialQuery,
  locator,
  messages,
  queryErrorDetails,
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

type View = "matches" | "context" | "summary"
export function SearchPlayground({ lang }: { lang: string }) {
  const language = lang === "ru" || lang === "es" ? lang : "en"
  const text = copy[language]
  const [query, setQuery] = useState(initialQuery)
  const [suggestionOpen, setSuggestionOpen] = useState(false)
  const [cursor, setCursor] = useState(initialQuery.length)
  const [view, setView] = useState<View>("matches")
  const [selected, setSelected] = useState("12")
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [tool, setTool] = useState("tg")
  const input = useRef<HTMLInputElement>(null)
  const section = useRef<HTMLElement>(null)
  const id = useId()
  const result = useMemo(() => {
    try {
      return { hits: searchDemo(query), error: null }
    } catch (error) {
      return { hits: [] as Hit[], error: queryErrorDetails(error) }
    }
  }, [query])
  const errorHint = result.error
    ? !result.error.reason
      ? text.sampleError
      : result.error.reason.startsWith("unsupported")
        ? text.unsupported
        : text.invalid
    : null
  const words = useMemo(() => highlightWords(query), [query])
  const suggestions = useMemo(() => suggestionsFor(query, cursor), [query, cursor])
  const active =
    result.hits.find((hit) => hit.message.id === selected) ??
    result.hits.find((hit) => hit.context.some((message) => message.id === selected)) ??
    result.hits[0]
  const anchor = active?.context.find((message) => message.id === selected) ?? active?.message
  const evidence = [
    ...new Map(result.hits.flatMap((hit) => hit.context).map((message) => [message.id, message])).values(),
  ]
  const facts = [
    { id: "12", text: text.deadline },
    { id: "22", text: text.budget },
  ].filter((fact) => evidence.some((message) => message.id === fact.id))
  const command = `${tool} messages search '${query.replaceAll("'", "'\\''")}' --source all --context 2 --json`
  const update = (value: string, position = value.length) => {
    setQuery(value)
    setSuggestionOpen(/(?:chat|from|date|kind|has|in):$/u.test(value))
    setCursor(position)
    setCopied(false)
    setCopyError(false)
    requestAnimationFrame(() => {
      input.current?.focus()
      input.current?.setSelectionRange(position, position)
    })
  }
  const add = (value: string) => update(`${query.trim()} ${value}`.trim())
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
    setView("context")
  }
  return (
    <section ref={section} className="search-playground" id="search-playground" aria-labelledby={`${id}-title`}>
      <div className="sp-heading">
        <span className="sp-eyebrow">
          <Sparkles size={14} aria-hidden />
          {text.eyebrow}
        </span>
        <h2 className="big" id={`${id}-title`}>
          {text.title}
        </h2>
        <p>{text.intro}</p>
      </div>
      <div className="sp-workspace">
        <div className="sp-editor">
          <div className="sp-topline">
            <span>
              <span className="sp-dot" />
              {text.archive}
            </span>
            <span>Lucene</span>
          </div>
          <Autocomplete.Root
            items={suggestions}
            open={suggestionOpen}
            onOpenChange={setSuggestionOpen}
            filter={null}
            mode="list"
            value={query}
            itemToStringValue={(item: Suggestion) => item.value}
            onValueChange={(value) => {
              const suggestion = suggestions.find((item) => item.value === value)
              setQuery(value)
              setCursor(suggestion?.cursor ?? input.current?.selectionStart ?? value.length)
              setCopied(false)
              setCopyError(false)
              if (suggestion)
                requestAnimationFrame(() => input.current?.setSelectionRange(suggestion.cursor, suggestion.cursor))
            }}
          >
            <label htmlFor={`${id}-input`} className="sp-label">
              {text.label}
            </label>
            <div className={`sp-input-wrap${result.error?.reason ? " sp-invalid" : ""}`}>
              <Search size={20} aria-hidden />
              <Autocomplete.Input
                ref={input}
                id={`${id}-input`}
                className="sp-input"
                placeholder={text.placeholder}
                aria-invalid={!!result.error?.reason}
                aria-describedby={`${id}-hint`}
                spellCheck={false}
                autoComplete="off"
                onSelect={(event) => setCursor(event.currentTarget.selectionStart ?? query.length)}
              />
              <Autocomplete.Trigger className="sp-trigger" aria-label={text.advanced}>
                <ArrowDown size={16} aria-hidden />
              </Autocomplete.Trigger>
            </div>
            <Autocomplete.Portal container={section}>
              <Autocomplete.Positioner sideOffset={10} align="start" className="sp-positioner">
                <Autocomplete.Popup className="sp-popup">
                  <div className="sp-popup-label">{text.advanced}</div>
                  <Autocomplete.List>
                    {(item: Suggestion) => (
                      <Autocomplete.Item className="sp-suggestion" key={item.value} value={item}>
                        <span>{item.label}</span>
                        <small>{item.detail}</small>
                        <ChevronRight size={14} aria-hidden />
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.List>
                  <div className="sp-popup-footer">{text.keyboard}</div>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
          <p id={`${id}-hint`} className="sp-hint" role="status">
            {errorHint ?? text.hint}
          </p>
          <div className="sp-filters">
            <button type="button" onClick={() => add("chat:")}>
              {text.chat}
              <span>+</span>
            </button>
            <button type="button" onClick={() => add("from:")}>
              {text.person}
              <span>+</span>
            </button>
            <label className="sp-date">
              {text.date}
              <input
                aria-label={text.date}
                type="date"
                onChange={(event) => {
                  if (event.target.value) add(`date:${event.target.value}`)
                }}
              />
            </label>
            <button type="button" onClick={() => add("has:file")}>
              <FileText size={13} aria-hidden />
              {text.attachment}
              <span>+</span>
            </button>
            <span className="sp-zone">{text.utc}</span>
          </div>
          <div className="sp-examples">
            <span>{text.examples}</span>
            {examples.map((example, index) => (
              <button type="button" key={example} aria-pressed={query === example} onClick={() => update(example)}>
                {text.examplesLabels[index]}
                <ArrowUpRight size={12} aria-hidden />
              </button>
            ))}
          </div>
        </div>
        <div className="sp-results-bar">
          <fieldset className="sp-views" aria-label={text.countLabel}>
            {(["matches", "context", "summary"] as const).map((tab) => (
              <button type="button" key={tab} aria-pressed={view === tab} onClick={() => setView(tab)}>
                {text[tab]}
                {tab === "matches" && <span>{result.hits.length}</span>}
              </button>
            ))}
          </fieldset>
          <span className="sp-results-count" aria-live="polite">
            {text.matches}: {result.hits.length}
          </span>
        </div>
        <section className="sp-results" aria-label={text.countLabel}>
          {result.hits.length === 0 ? (
            <div className="sp-empty">
              <Search size={25} aria-hidden />
              <h3>{text.empty}</h3>
              <p>{errorHint ?? text.emptyHelp}</p>
            </div>
          ) : view === "matches" ? (
            <div className="sp-hit-list">
              {result.hits.map(({ message }) => (
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
          ) : view === "context" && active ? (
            <div className="sp-context">
              <div className="sp-context-title">
                <MessageSquare size={17} aria-hidden />
                <strong>{active.message.chat}</strong>
                <span>{active.message.provider === "max" ? "MAX" : "Telegram"}</span>
              </div>
              <div className="sp-context-picker">
                {result.hits.map((hit) => (
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
            disabled={!!result.error?.reason || !query.trim()}
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
          <a href="https://github.com/leemour/max-cli/blob/main/docs/search.md">
            MAX {text.reference}
            <ArrowUpRight size={13} aria-hidden />
          </a>
          <a href="https://github.com/leemour/tg-cli/blob/main/docs/search.md">
            Telegram {text.reference}
            <ArrowUpRight size={13} aria-hidden />
          </a>
        </div>
      </div>
      <details className="sp-disclosure">
        <summary>{text.advanced}</summary>
        <p>{text.unavailable}</p>
        <code>AND · OR · NOT · chat: · from: · date: · has: · kind: · text:</code>
        <a href="https://github.com/leemour/cli-messaging/blob/main/docs/search/query-language.md">
          Lucene reference ↗
        </a>
      </details>
    </section>
  )
}
