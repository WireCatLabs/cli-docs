"use client"

import { ArrowRight, ChevronUp, LoaderCircle, MailCheck, MessageSquare } from "lucide-react"
import { type FormEvent, type ReactNode, useId, useState } from "react"
import { GoogleIcon } from "@/components/brand-icons"
import { ideaPath } from "@/lib/ideas"
import { type BoardIdea, type Comment, maxTags } from "@/lib/ideas/board/types"
import { boardWords, formatAgo } from "@/lib/ideas/board/words"
import { ideaTools } from "@/lib/ideas/types"
import { errorText, ideasWords } from "@/lib/ideas/words"
import { localizedPath } from "@/lib/site-routes"
import { StatusLabel } from "../status-label"
import { TurnstileField } from "../turnstile-field"
import { type Board, type Composer, type SignInReason, useIdeaThread } from "./use-board"

export function Vote({ board, idea, className = "" }: { board: Board; idea: BoardIdea; className?: string }) {
  const words = ideasWords(board.lang)
  return (
    <button
      type="button"
      className={`board-vote ${className}`}
      aria-pressed={idea.voted}
      aria-label={`${idea.voted ? words.unvote(idea.title) : words.vote(idea.title)}, ${idea.votes} ${words.votes(idea.votes)}`}
      onClick={(event) => {
        event.stopPropagation()
        board.vote(idea)
      }}
    >
      <ChevronUp aria-hidden="true" />
      <span className="board-vote-count">{idea.votes}</span>
    </button>
  )
}

export function TagLinks({ board, idea }: { board: Board; idea: BoardIdea }) {
  if (!idea.tags.length) return null
  return (
    <span className="board-tags">
      {idea.tags.map((tag) => (
        <button
          key={tag.slug}
          type="button"
          className="board-tag"
          aria-pressed={board.query.tag === tag.slug}
          onClick={(event) => {
            event.stopPropagation()
            board.setQuery({ tag: board.query.tag === tag.slug ? undefined : tag.slug })
          }}
        >
          #{tag.name}
        </button>
      ))}
    </span>
  )
}

export function CommentCount({ lang, count }: { lang: string; count: number }) {
  if (!count) return null
  return (
    <span className="board-comments-count" title={boardWords(lang).commentCount(count)}>
      <MessageSquare aria-hidden="true" />
      {count}
      <span className="sr-only">{boardWords(lang).commentCount(count)}</span>
    </span>
  )
}

export function IdeaMeta({ board, idea, tags = true }: { board: Board; idea: BoardIdea; tags?: boolean }) {
  return (
    <span className="board-meta">
      <StatusLabel lang={board.lang} status={idea.status} />
      <span className="board-tool">{ideasWords(board.lang).tools[idea.tool]}</span>
      {tags && <TagLinks board={board} idea={idea} />}
      <CommentCount lang={board.lang} count={idea.commentsCount} />
    </span>
  )
}

/** A link for people who open it in a new tab; a click stays on the page and opens the idea in place. */
export function IdeaLink({
  board,
  idea,
  children,
  className,
}: {
  board: Board
  idea: BoardIdea
  children: ReactNode
  className?: string
}) {
  return (
    <a
      className={className}
      href={ideaPath(board.lang, idea.id)}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        event.preventDefault()
        board.select(board.selected === idea.id ? null : idea.id)
      }}
    >
      {children}
    </a>
  )
}

export function Answer({ lang, idea }: { lang: string; idea: BoardIdea }) {
  const words = ideasWords(lang)
  if (!idea.answer && !idea.statusReason && !idea.links.length) return null
  return (
    <section className="board-answer" data-status={idea.status}>
      <h3>{idea.statusReason ? words.whyNot : words.answer}</h3>
      <p>{idea.statusReason ?? idea.answer}</p>
      {idea.links.length > 0 && (
        <ul>
          {idea.links.map((link) => (
            <li key={link.url}>
              <a href={link.url.startsWith("/") ? localizedPath(link.url, lang) : link.url}>
                {link.label}
                <ArrowRight aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

function CommentItem({ lang, comment }: { lang: string; comment: Comment }) {
  const words = boardWords(lang)
  const name = comment.author.name ?? ideasWords(lang).aMember
  return (
    <li className="board-comment" data-team={comment.author.team || undefined}>
      <span className="board-avatar" aria-hidden="true">
        {initials(name)}
      </span>
      <div>
        <p className="board-comment-head">
          <strong>{name}</strong>
          {comment.author.team && <span className="board-team">{words.team}</span>}
          <time dateTime={comment.createdAt}>{formatAgo(lang, comment.createdAt)}</time>
        </p>
        <p className="board-comment-body">{comment.body}</p>
      </div>
    </li>
  )
}

export function Comments({ board, thread }: { board: Board; thread: ReturnType<typeof useIdeaThread> }) {
  const words = boardWords(board.lang)
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const fieldId = useId()

  const send = async () => {
    if (!body.trim()) return
    if (!board.member) return board.signIn.ask("comment", () => undefined)
    setSending(true)
    setError("")
    try {
      await thread.add(body.trim())
      setBody("")
    } catch (failure) {
      setError(errorText(board.lang, failure, words.commentFailed))
    }
    setSending(false)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    send()
  }

  const count = thread.comments?.length ?? 0
  return (
    <section className="board-thread" aria-label={words.comments}>
      <h3>
        {words.comments}
        {count > 0 && <span className="board-thread-count">{count}</span>}
      </h3>
      {thread.failed && <p className="board-error">{words.commentsFailed}</p>}
      {!thread.comments && !thread.failed && (
        <div className="board-thread-loading" aria-busy="true">
          <span />
          <span />
        </div>
      )}
      {thread.comments && count === 0 && <p className="board-quiet">{words.noComments}</p>}
      {thread.comments && count > 0 && (
        <ol className="board-comments">
          {thread.comments.map((comment) => (
            <CommentItem key={comment.id} lang={board.lang} comment={comment} />
          ))}
        </ol>
      )}
      <form className="board-comment-form" onSubmit={submit}>
        <label className="sr-only" htmlFor={fieldId}>
          {words.commentLabel}
        </label>
        <textarea
          id={fieldId}
          rows={2}
          maxLength={2000}
          placeholder={words.commentPlaceholder}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) send()
          }}
        />
        <div className="board-comment-actions">
          {error && (
            <p className="board-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="board-button board-button-primary" disabled={sending || !body.trim()}>
            {sending ? words.commentSending : board.member === null ? words.signInToComment : words.commentSend}
          </button>
        </div>
      </form>
    </section>
  )
}

export function Byline({ lang, idea }: { lang: string; idea: BoardIdea }) {
  const words = ideasWords(lang)
  const name = idea.author.name ?? (idea.author.team ? words.team : words.aMember)
  return (
    <p className="board-byline">
      <span>{name}</span>
      {idea.author.team && idea.author.name && <span className="board-team">{boardWords(lang).team}</span>}
      <span aria-hidden="true">·</span>
      <time dateTime={idea.createdAt}>{formatAgo(lang, idea.createdAt)}</time>
    </p>
  )
}

export function ComposerFields({
  board,
  composer,
  titleField = true,
  similar = true,
}: {
  board: Board
  composer: Composer
  titleField?: boolean
  similar?: boolean
}) {
  const words = boardWords(board.lang)
  const form = ideasWords(board.lang).form
  const tools = ideasWords(board.lang).tools
  const ids = useId()
  return (
    <>
      {titleField && (
        <div className="board-field">
          <label htmlFor={`${ids}-title`}>{form.titleLabel}</label>
          <input
            id={`${ids}-title`}
            value={composer.title}
            maxLength={120}
            autoComplete="off"
            placeholder={form.titleHint}
            aria-invalid={!!composer.titleError}
            onChange={(event) => composer.setTitle(event.target.value)}
          />
          {composer.titleError && <p className="board-error">{composer.titleError}</p>}
        </div>
      )}
      {similar && <Similar board={board} composer={composer} />}
      <div className="board-field">
        <label htmlFor={`${ids}-body`}>
          {form.bodyLabel} <span className="board-optional">{form.bodyHint}</span>
        </label>
        <textarea
          id={`${ids}-body`}
          rows={4}
          maxLength={5000}
          value={composer.body}
          onChange={(event) => composer.setBody(event.target.value)}
        />
      </div>
      <fieldset className="board-field board-choice">
        <legend>{form.toolLabel}</legend>
        <div className="board-choice-options">
          {ideaTools.map((tool) => (
            <label key={tool} className="board-option">
              <input
                type="radio"
                name={`${ids}-tool`}
                value={tool}
                checked={composer.tool === tool}
                onChange={() => composer.setTool(tool)}
              />
              <span>{tools[tool]}</span>
            </label>
          ))}
        </div>
        {composer.toolError && <p className="board-error">{composer.toolError}</p>}
      </fieldset>
      {board.tags.length > 0 && (
        <fieldset className="board-field board-choice">
          <legend>
            {words.tags} <span className="board-optional">{words.tagsHint}</span>
          </legend>
          <div className="board-choice-options">
            {board.tags.map((tag) => {
              const on = composer.tags.includes(tag.slug)
              return (
                <label
                  key={tag.slug}
                  className="board-option"
                  data-full={(!on && composer.tags.length >= maxTags) || undefined}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    disabled={!on && composer.tags.length >= maxTags}
                    onChange={() => composer.toggleTag(tag.slug)}
                  />
                  <span>#{tag.name}</span>
                </label>
              )
            })}
          </div>
        </fieldset>
      )}
    </>
  )
}

export function Similar({ board, composer }: { board: Board; composer: Composer }) {
  const words = boardWords(board.lang)
  return (
    <div className="board-similar" aria-live="polite">
      {composer.similar.length > 0 && (
        <>
          <p className="board-similar-title">{words.already}</p>
          <ul>
            {composer.similar.map((idea) => {
              const shown = board.view(idea)
              return (
                <li key={idea.id}>
                  <Vote board={board} idea={shown} className="board-vote-mini" />
                  <span>
                    <a href={ideaPath(board.lang, idea.id)} target="_blank" rel="noopener">
                      {shown.title}
                    </a>
                    <IdeaMeta board={board} idea={shown} tags={false} />
                  </span>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export function ComposerSubmit({
  board,
  composer,
  onCancel,
}: {
  board: Board
  composer: Composer
  onCancel?: () => void
}) {
  const words = boardWords(board.lang)
  const form = ideasWords(board.lang).form
  return (
    <div className="board-submit">
      {board.member && <TurnstileField lang={board.lang} onToken={composer.setToken} resetKey={composer.resetKey} />}
      {composer.error && (
        <p className="board-error" role="alert">
          {composer.error}
        </p>
      )}
      <div className="board-submit-row">
        {onCancel && (
          <button type="button" className="board-button" onClick={onCancel}>
            {words.cancel}
          </button>
        )}
        <button
          type="button"
          className="board-button board-button-primary"
          disabled={composer.sending || (!!board.member && !composer.token)}
          onClick={composer.submit}
        >
          {composer.sending ? form.sending : form.submit}
        </button>
      </div>
    </div>
  )
}

const reasonText = (lang: string, reason: SignInReason) => {
  const words = boardWords(lang)
  return reason === "vote" ? words.signInVote : reason === "post" ? words.signInPost : words.signInComment
}

/** Google opens in a small window and this page carries on when it closes; the email link is the fallback. */
export function SignInBox({ board, compact = false }: { board: Board; compact?: boolean }) {
  const words = boardWords(board.lang)
  const signInWords = ideasWords(board.lang).signIn
  const { signIn } = board
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [resetKey, setResetKey] = useState(0)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [showEmail, setShowEmail] = useState(false)
  const fieldId = useId()

  if (sent)
    return (
      <div className="board-signin" data-compact={compact || undefined}>
        <MailCheck className="board-signin-icon" aria-hidden="true" />
        <p className="board-signin-title" role="status">
          {signInWords.check}
        </p>
        <p className="board-quiet">{signInWords.checkText(email)}</p>
        <button type="button" className="board-link-button" onClick={() => setSent(false)}>
          {signInWords.other}
        </button>
      </div>
    )

  const send = async (event: FormEvent) => {
    event.preventDefault()
    setSending(true)
    if (await signIn.sendLink(email, token)) setSent(true)
    setSending(false)
    setToken("")
    setResetKey((key) => key + 1)
  }

  return (
    <div className="board-signin" data-compact={compact || undefined}>
      <p className="board-signin-title">{signIn.reason ? reasonText(board.lang, signIn.reason) : words.signInTitle}</p>
      <button
        type="button"
        className="board-button board-google"
        onClick={signIn.google}
        disabled={signIn.state === "waiting"}
      >
        {signIn.state === "waiting" ? <LoaderCircle className="board-spin" aria-hidden="true" /> : <GoogleIcon />}
        {signIn.state === "waiting" ? words.waiting : signInWords.google}
      </button>
      {signIn.error && (
        <p className="board-error" role="alert">
          {signIn.error}
        </p>
      )}
      {showEmail ? (
        <form className="board-signin-email" onSubmit={send}>
          <label htmlFor={fieldId}>{signInWords.emailLabel}</label>
          <div className="board-inline-field">
            <input
              id={fieldId}
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit" className="board-button" disabled={sending || !token}>
              {sending ? signInWords.sending : signInWords.send}
            </button>
          </div>
          <TurnstileField lang={board.lang} onToken={setToken} resetKey={resetKey} />
        </form>
      ) : (
        <button type="button" className="board-link-button" onClick={() => setShowEmail(true)}>
          {signInWords.or} {signInWords.send.toLowerCase()}
        </button>
      )}
    </div>
  )
}

export function ListState({ board, onPost }: { board: Board; onPost?: () => void }) {
  const words = boardWords(board.lang)
  const ideas = ideasWords(board.lang)
  if (board.failed && !board.list)
    return (
      <div className="board-empty" role="alert">
        <p className="board-empty-title">{ideas.down}</p>
        <p>{ideas.downText}</p>
        <button type="button" className="board-button" onClick={board.retry}>
          {ideas.retry}
        </button>
      </div>
    )
  if (!board.list)
    return (
      <div className="board-skeleton" aria-busy="true">
        <span className="sr-only" role="status">
          {ideas.loading}
        </span>
        {[0, 1, 2, 3, 4].map((row) => (
          <span key={row} />
        ))}
      </div>
    )
  if (!board.list.ideas.length)
    return (
      <div className="board-empty">
        <p className="board-empty-title">{words.nothing}</p>
        <p>{words.nothingText}</p>
        <div className="board-submit-row">
          {board.filtered && (
            <button type="button" className="board-button" onClick={board.clear}>
              {words.clear}
            </button>
          )}
          {onPost && (
            <button type="button" className="board-button board-button-primary" onClick={onPost}>
              {words.newIdea}
            </button>
          )}
        </div>
      </div>
    )
  return null
}

/** A thin bar over the list while a new answer is on its way; the old rows stay readable under it. */
export function Progress({ board }: { board: Board }) {
  return (
    <div className="board-progress" data-on={board.pending || undefined} aria-hidden="true">
      <span />
    </div>
  )
}

export function FilterSelect<T extends string>({
  label,
  value,
  options,
  anyLabel,
  onChange,
}: {
  label: string
  value: T | undefined
  options: { value: T; label: string }[]
  anyLabel: string
  onChange: (value: T | undefined) => void
}) {
  const id = useId()
  return (
    <span className="board-select" data-set={value ? true : undefined}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(event) => onChange((event.target.value || undefined) as T | undefined)}
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </span>
  )
}

/** The open idea: what it asks, the answer, who posted it, and the comments. Each variant frames it. */
export function IdeaDetail({
  board,
  id,
  title = true,
  head,
}: {
  board: Board
  id: string
  title?: boolean
  head?: ReactNode
}) {
  const thread = useIdeaThread(board, id)
  const { idea } = thread
  if (idea === null) return <p className="board-quiet">{ideasWords(board.lang).goneText}</p>
  if (!idea)
    return (
      <div className="board-thread-loading" aria-busy="true">
        <span />
        <span />
      </div>
    )
  return (
    <article className="board-detail" aria-labelledby={title ? `idea-${idea.id}` : undefined}>
      {head}
      {title && (
        <header className="board-detail-head">
          <IdeaMeta board={board} idea={idea} tags={false} />
          <div className="board-detail-title">
            <h2 id={`idea-${idea.id}`}>{idea.title}</h2>
            <Vote board={board} idea={idea} className="board-vote-wide" />
          </div>
        </header>
      )}
      {idea.body && <p className="board-detail-body">{idea.body}</p>}
      <div className="board-detail-facts">
        <Byline lang={board.lang} idea={idea} />
        <TagLinks board={board} idea={idea} />
      </div>
      <Answer lang={board.lang} idea={idea} />
      <Comments board={board} thread={thread} />
    </article>
  )
}
