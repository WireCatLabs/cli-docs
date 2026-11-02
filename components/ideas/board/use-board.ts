"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { ideas, ideasSample, returnPath } from "@/lib/ideas"
import { boardWords } from "@/lib/ideas/board-words"
import { setPreviewMode } from "@/lib/ideas/sample"
import {
  asLocale,
  type Comment,
  type Idea,
  type IdeaQuery,
  IdeasError,
  type IdeaTool,
  isSort,
  isStatus,
  isTool,
  type Member,
  maxTags,
  type Tag,
} from "@/lib/ideas/types"
import { errorText, ideasWords } from "@/lib/ideas/words"
import { memberChanged } from "../use-member"
import { listenForSignIn, popupReturnPath } from "./popup"

export type SignInReason = "vote" | "post" | "comment"

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Swaps content inside a view transition where the browser has one, so rows glide to their new place. */
export function smoothly(update: () => void) {
  const start = typeof document !== "undefined" ? document.startViewTransition?.bind(document) : undefined
  if (!start || reducedMotion()) return update()
  const transition = start(() => flushSync(update))
  transition.ready.catch(() => {})
  transition.finished.catch(() => {})
}

const motionMs = 280

/**
 * While an idea opens, closes or another one closes above it, the row that was clicked stays where it was on
 * screen; once the panel has settled it scrolls smoothly, and only if the panel ends below the fold.
 */
function keepInPlace(id: string | null) {
  const row = id ? document.querySelector<HTMLElement>(`[data-idea="${CSS.escape(id)}"]`) : null
  if (!row) return
  const start = row.getBoundingClientRect().top
  const onScreen = start >= 0 && start < window.innerHeight
  const end = performance.now() + motionMs + 40
  const step = () => {
    const now = row.getBoundingClientRect().top
    if (onScreen && Math.abs(now - start) >= 1) window.scrollBy(0, now - start)
    if (performance.now() < end) requestAnimationFrame(step)
    else reveal(row)
  }
  requestAnimationFrame(step)
}

function reveal(row: HTMLElement) {
  if (!row.matches("[data-open]")) return
  const box = row.getBoundingClientRect()
  const room = 24
  const top = 72
  let delta = 0
  if (box.top < 0 || box.top > window.innerHeight - room) delta = box.top - top
  else if (box.bottom > window.innerHeight - room)
    delta = Math.min(box.bottom - window.innerHeight + room, box.top - top)
  if (Math.abs(delta) >= 1) window.scrollBy({ top: delta, behavior: reducedMotion() ? "auto" : "smooth" })
}

type Query = Omit<IdeaQuery, "page" | "perPage">

const readQuery = (): Query => {
  const params = new URLSearchParams(window.location.search)
  const sort = params.get("sort")
  return {
    tool: isTool(params.get("tool")) ? (params.get("tool") as IdeaTool) : undefined,
    status: isStatus(params.get("status")) ? (params.get("status") as Query["status"]) : undefined,
    tag: params.get("tag") || undefined,
    q: params.get("q") || undefined,
    sort: isSort(sort) ? sort : "top",
  }
}

function writeUrl(query: Query, selected: string | null) {
  const params = new URLSearchParams(window.location.search)
  for (const key of ["tool", "status", "tag", "q", "sort", "id", "preview", "compose", "merged"]) params.delete(key)
  if (query.tool) params.set("tool", query.tool)
  if (query.status) params.set("status", query.status)
  if (query.tag) params.set("tag", query.tag)
  if (query.q) params.set("q", query.q)
  if (query.sort !== "top") params.set("sort", query.sort)
  if (selected) params.set("id", selected)
  const search = params.toString()
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${search ? `?${search}` : ""}`)
}

type List = { ideas: Idea[]; total: number; page: number }

/** Every idea, for the sidebar's roadmap and tag counts: up to 3 pages of 50, so a few calls cover the board. */
async function overview() {
  const found: Idea[] = []
  for (let page = 1; page <= 3; page++) {
    const result = await ideas.list({ sort: "top", page, perPage: 50 })
    for (const idea of result.ideas) found.push(idea)
    if (found.length >= result.total || !result.ideas.length) break
  }
  return found
}

/** The page's state: filters in the address, a list that never blanks, votes, the open idea, sign-in. */
export function useIdeasBoard(lang: string) {
  const [query, setQueryState] = useState<Query>({ sort: "top" })
  const [search, setSearchState] = useState("")
  const [list, setList] = useState<List>()
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [more, setMore] = useState<"idle" | "loading" | "failed">("idle")
  const [tags, setTags] = useState<Tag[]>([])
  const [all, setAll] = useState<Idea[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [merged, setMerged] = useState(false)
  const [composeAsked, setComposeAsked] = useState(false)
  const [patches, setPatches] = useState<Record<string, Partial<Idea>>>({})
  const [member, setMember] = useState<Member | null>()
  const [ready, setReady] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const initial = readQuery()
    const params = new URLSearchParams(window.location.search)
    setQueryState(initial)
    setSearchState(initial.q ?? "")
    setSelected(params.get("id"))
    setMerged(params.has("merged"))
    setComposeAsked(params.get("compose") === "1")
    setReady(true)
    ideas.tags().then(setTags, () => setTags([]))
    overview().then(setAll, () => setAll([]))
  }, [])

  useEffect(() => {
    if (ready) writeUrl(query, selected)
  }, [ready, query, selected])

  // biome-ignore lint/correctness/useExhaustiveDependencies: `attempt` is the retry button's way to load again.
  useEffect(() => {
    if (!ready) return
    let current = true
    // Only a slow answer dims the list; a quick one swaps straight in.
    const dim = setTimeout(() => current && setPending(true), 140)
    setFailed(false)
    setMore("idle")
    ideas
      .list(query)
      .then((next) => {
        if (!current) return
        smoothly(() => {
          setList({ ideas: next.ideas, total: next.total, page: next.page })
          setPending(false)
        })
      })
      .catch(() => {
        if (!current) return
        setPending(false)
        setFailed(true)
      })
      .finally(() => clearTimeout(dim))
    return () => {
      current = false
      clearTimeout(dim)
    }
  }, [ready, query, attempt])

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => {
      const trimmed = search.trim()
      // The API searches from 3 characters; shorter text leaves the list as it is.
      const q = trimmed.length >= 3 ? trimmed : undefined
      setQueryState((before) => (before.q === q ? before : { ...before, q }))
    }, 250)
    return () => clearTimeout(timer)
  }, [ready, search])

  const refreshMember = useCallback(
    () =>
      ideas.member().then(
        (value) => setMember(value),
        () => setMember(null),
      ),
    [],
  )
  useEffect(() => {
    refreshMember()
    const onVisible = () => document.visibilityState === "visible" && refreshMember()
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [refreshMember])

  const setQuery = useCallback((change: Partial<Query>) => setQueryState((before) => ({ ...before, ...change })), [])
  const clear = useCallback(() => {
    setSearchState("")
    setQueryState((before) => ({ sort: before.sort }))
  }, [])

  const patch = useCallback(
    (id: string, change: Partial<Idea>) => setPatches((before) => ({ ...before, [id]: { ...before[id], ...change } })),
    [],
  )
  const view = useCallback((idea: Idea): Idea => ({ ...idea, ...patches[idea.id] }), [patches])

  const signIn = useSignIn(lang, member, refreshMember)

  const vote = useCallback(
    async (idea: Idea) => {
      const before = { voted: idea.voted, votes: idea.votes }
      patch(idea.id, { voted: !before.voted, votes: before.votes + (before.voted ? -1 : 1) })
      try {
        patch(idea.id, await (before.voted ? ideas.unvote(idea.id) : ideas.vote(idea.id)))
      } catch (error) {
        const code = error instanceof IdeasError ? error.code : "unavailable"
        // The server already had it the way the reader wanted; only the button was stale.
        if (code === "already_voted") patch(idea.id, { voted: true, votes: before.votes })
        else if (code === "not_voted") patch(idea.id, { voted: false, votes: before.votes })
        else patch(idea.id, before)
        if (code === "sign_in_required") refreshMember()
      }
    },
    [patch, refreshMember],
  )
  const askVote = useCallback(
    (idea: Idea) => (member ? vote(idea) : signIn.ask("vote", () => vote(idea))),
    [member, vote, signIn],
  )

  const loadMore = async () => {
    if (!list) return
    setMore("loading")
    try {
      const next = await ideas.list({ ...query, page: list.page + 1 })
      const seen = new Set(list.ideas.map((idea) => idea.id))
      setList({
        ideas: [...list.ideas, ...next.ideas.filter((idea) => !seen.has(idea.id))],
        total: next.total,
        page: next.page,
      })
      setMore("idle")
    } catch {
      setMore("failed")
    }
  }

  const selectedNow = useRef<string | null>(null)
  selectedNow.current = selected
  const select = useCallback((id: string | null) => {
    setMerged(false)
    keepInPlace(id ?? selectedNow.current)
    setSelected(id)
  }, [])
  const forward = useCallback((id: string) => {
    setMerged(true)
    setSelected(id)
  }, [])
  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  return {
    lang,
    query,
    setQuery,
    search,
    setSearch: setSearchState,
    clear,
    filtered: !!(query.tool || query.status || query.tag || query.q),
    list: list && { ...list, ideas: list.ideas.map(view) },
    more,
    loadMore,
    pending,
    failed,
    retry,
    tags,
    all: all.map(view),
    selected,
    select,
    merged,
    forward,
    composeAsked,
    view,
    patch,
    member,
    vote: askVote,
    signIn,
    addPosted: (idea: Idea) => {
      setAll((before) => [idea, ...before])
      smoothly(() =>
        setList((before) => before && { ...before, ideas: [idea, ...before.ideas], total: before.total + 1 }),
      )
    },
  }
}

export type Board = ReturnType<typeof useIdeasBoard>

/**
 * Sign-in without leaving the page: Google in a pop-up window, or an emailed link. A blocked action waits in
 * `pending` and runs once the member is known.
 */
function useSignIn(lang: string, member: Member | null | undefined, refreshMember: () => Promise<void>) {
  const words = boardWords(lang)
  const [reason, setReason] = useState<SignInReason | null>(null)
  const [state, setState] = useState<"idle" | "waiting" | "blocked">("idle")
  const [error, setError] = useState("")
  const pending = useRef<(() => void) | null>(null)
  const popup = useRef<Window | null>(null)

  const finish = useCallback(
    async (failure?: string) => {
      if (failure) {
        const messages = ideasWords(lang).google as Record<string, string>
        setError(messages[failure] ?? ideasWords(lang).signIn.failed)
        setState("idle")
        return
      }
      // The sample keeps its session in session storage, and the pop-up has its own copy.
      if (ideasSample) setPreviewMode("signed-in")
      await refreshMember()
      window.dispatchEvent(new Event(memberChanged))
      setState("idle")
    },
    [lang, refreshMember],
  )

  useEffect(() => listenForSignIn((failure) => finish(failure)), [finish])

  useEffect(() => {
    if (!member || !reason) return
    const action = pending.current
    pending.current = null
    setReason(null)
    action?.()
  }, [member, reason])

  useEffect(() => {
    if (state !== "waiting") return
    const timer = setInterval(() => {
      if (popup.current && !popup.current.closed) return
      clearInterval(timer)
      refreshMember().finally(() => setState((now) => (now === "waiting" ? "idle" : now)))
    }, 500)
    return () => clearInterval(timer)
  }, [state, refreshMember])

  // The window opens on the click, before any await, or the browser blocks it; Google's address follows once the
  // API says Google sign-in is set up.
  const google = async () => {
    setError("")
    const locale = asLocale(lang)
    const back = popupReturnPath(lang)
    const width = 480
    const height = 640
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2)
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 3)
    const opened = window.open("", "wirecat-sign-in", `popup,width=${width},height=${height},left=${left},top=${top}`)
    if (!opened) return setState("blocked")
    popup.current = opened
    setState("waiting")
    try {
      await ideas.googleSignInReady(locale, back)
      opened.location.href = ideas.googleSignInUrl(locale, back)
    } catch (failure) {
      opened.close()
      setState("idle")
      setError(errorText(lang, failure, ideasWords(lang).signIn.failed))
    }
  }

  const sendLink = async (email: string, turnstileToken: string) => {
    setError("")
    try {
      await ideas.requestSignInLink({
        email,
        locale: asLocale(lang),
        returnTo: returnPath(lang, window.location.pathname, window.location.search),
        turnstileToken,
      })
      return true
    } catch (failure) {
      setError(errorText(lang, failure, ideasWords(lang).signIn.failed))
      return false
    }
  }

  return {
    reason,
    state,
    error: state === "blocked" ? words.popupBlocked : error,
    ask: useCallback((why: SignInReason, then?: () => void) => {
      pending.current = then ?? null
      setReason(why)
    }, []),
    cancel: () => {
      pending.current = null
      setReason(null)
      setError("")
      setState("idle")
    },
    google,
    sendLink,
  }
}

export type SignIn = ReturnType<typeof useSignIn>

/** One idea with its comments, loaded when it opens. A merged duplicate forwards to the idea that kept its votes. */
export function useIdeaThread(board: Board, id: string) {
  const [idea, setIdea] = useState<Idea | null>()
  const [comments, setComments] = useState<Comment[]>()
  const [failed, setFailed] = useState(false)
  const { forward } = board

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only a new id starts a load, list updates reach it through board.view.
  useEffect(() => {
    let current = true
    const known = board.list?.ideas.find((item) => item.id === id)
    setIdea(known)
    setComments(undefined)
    setFailed(false)
    if (!known)
      ideas.get(id).then(
        (found) => {
          if (!current) return
          if (found?.mergedIntoId) return forward(found.mergedIntoId)
          setIdea(found)
        },
        () => current && setIdea(null),
      )
    ideas.comments(id).then(
      (found) => current && setComments(found),
      () => current && setFailed(true),
    )
    return () => {
      current = false
    }
  }, [id, forward])

  const count = (change: number) => {
    const base = idea && board.view(idea)
    if (base) board.patch(id, { commentsCount: Math.max(0, base.commentsCount + change) })
  }

  const add = async (body: string, turnstileToken: string) => {
    const comment = await ideas.addComment(id, body, turnstileToken)
    setComments((before) => [...(before ?? []), comment])
    count(1)
  }

  const remove = async (commentId: string) => {
    await ideas.deleteComment(id, commentId)
    setComments((before) => before?.filter((comment) => comment.id !== commentId))
    count(-1)
  }

  return { idea: idea && board.view(idea), comments, failed, add, remove }
}

export type Thread = ReturnType<typeof useIdeaThread>

/** The new-idea form's state. */
export function useComposer(board: Board, onPosted: (idea: Idea) => void) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tool, setTool] = useState<IdeaTool | "">("")
  const [tags, setTags] = useState<string[]>([])
  const [similar, setSimilar] = useState<Idea[]>([])
  const [token, setToken] = useState("")
  const [resetKey, setResetKey] = useState(0)
  const [checked, setChecked] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const { lang } = board

  useEffect(() => {
    if (title.trim().length < 4) return setSimilar([])
    let current = true
    const timer = setTimeout(() => {
      ideas.similar(title).then(
        (found) => current && setSimilar(found),
        () => current && setSimilar([]),
      )
    }, 300)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [title])

  const form = ideasWords(lang).form
  const titleError = checked && title.trim().length < 5 ? form.tooShort : ""
  const toolError = checked && !tool ? form.noTool : ""

  const toggleTag = (slug: string) =>
    setTags((before) =>
      before.includes(slug)
        ? before.filter((item) => item !== slug)
        : before.length < maxTags
          ? [...before, slug]
          : before,
    )

  const reset = () => {
    setTitle("")
    setBody("")
    setTool("")
    setTags([])
    setChecked(false)
    setError("")
  }

  const submit = async () => {
    setChecked(true)
    if (title.trim().length < 5 || !tool) return
    if (!board.member) return board.signIn.ask("post")
    setSending(true)
    setError("")
    try {
      const idea = await ideas.create({ title: title.trim(), body: body.trim(), tool, tags, turnstileToken: token })
      reset()
      onPosted(idea)
    } catch (failure) {
      setError(errorText(lang, failure, form.failed))
    }
    setSending(false)
    setToken("")
    setResetKey((key) => key + 1)
  }

  return {
    title,
    setTitle,
    body,
    setBody,
    tool,
    setTool,
    tags,
    toggleTag,
    similar,
    token,
    setToken,
    resetKey,
    titleError,
    toolError,
    sending,
    error,
    submit,
    reset,
  }
}

export type Composer = ReturnType<typeof useComposer>
