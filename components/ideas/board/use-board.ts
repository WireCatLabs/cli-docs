"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { boardSource } from "@/lib/ideas/board/sample"
import {
  type BoardIdea,
  type BoardQuery,
  type BoardSort,
  type Comment,
  isBoardSort,
  maxTags,
  type Tag,
} from "@/lib/ideas/board/types"
import { boardWords } from "@/lib/ideas/board/words"
import { sampleSource, setPreviewMode } from "@/lib/ideas/sample"
import { asLocale, IdeasError, type IdeaTool, isStatus, isTool, type Member } from "@/lib/ideas/types"
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

const readQuery = (): BoardQuery => {
  const params = new URLSearchParams(window.location.search)
  const sort = params.get("sort")
  return {
    tool: isTool(params.get("tool")) ? (params.get("tool") as IdeaTool) : undefined,
    status: isStatus(params.get("status")) ? (params.get("status") as BoardQuery["status"]) : undefined,
    tag: params.get("tag") || undefined,
    q: params.get("q") || undefined,
    sort: isBoardSort(sort) ? sort : "top",
  }
}

function writeUrl(query: BoardQuery, selected: string | null) {
  const params = new URLSearchParams(window.location.search)
  for (const key of ["tool", "status", "tag", "q", "sort", "id", "preview"]) params.delete(key)
  if (query.tool) params.set("tool", query.tool)
  if (query.status) params.set("status", query.status)
  if (query.tag) params.set("tag", query.tag)
  if (query.q) params.set("q", query.q)
  if (query.sort !== "top") params.set("sort", query.sort)
  if (selected) params.set("id", selected)
  const search = params.toString()
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${search ? `?${search}` : ""}`)
}

type List = { ideas: BoardIdea[]; total: number }

/** Everything the three variants share: filters in the address, a list that never blanks, votes, sign-in. */
export function useIdeasBoard(lang: string) {
  const source = useMemo(() => boardSource(lang), [lang])
  const [query, setQueryState] = useState<BoardQuery>({ sort: "top" })
  const [search, setSearchState] = useState("")
  const [list, setList] = useState<List>()
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)
  const [tags, setTags] = useState<Tag[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [patches, setPatches] = useState<Record<string, Partial<BoardIdea>>>({})
  const [member, setMember] = useState<Member | null>()
  const [ready, setReady] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const initial = readQuery()
    setQueryState(initial)
    setSearchState(initial.q ?? "")
    setSelected(new URLSearchParams(window.location.search).get("id"))
    setReady(true)
    source.tags().then(setTags, () => setTags([]))
  }, [source])

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
    source
      .list(query)
      .then((next) => {
        if (!current) return
        smoothly(() => {
          setList(next)
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
  }, [ready, query, source, attempt])

  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => {
      const q = search.trim() || undefined
      setQueryState((before) => (before.q === q ? before : { ...before, q }))
    }, 220)
    return () => clearTimeout(timer)
  }, [ready, search])

  const refreshMember = useCallback(
    () =>
      source.member().then(
        (value) => setMember(value),
        () => setMember(null),
      ),
    [source],
  )
  useEffect(() => {
    refreshMember()
    const onVisible = () => document.visibilityState === "visible" && refreshMember()
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [refreshMember])

  const setQuery = useCallback(
    (change: Partial<BoardQuery>) => setQueryState((before) => ({ ...before, ...change })),
    [],
  )
  const clear = useCallback(() => {
    setSearchState("")
    setQueryState((before) => ({ sort: before.sort }))
  }, [])

  const patch = useCallback(
    (id: string, change: Partial<BoardIdea>) =>
      setPatches((before) => ({ ...before, [id]: { ...before[id], ...change } })),
    [],
  )
  const view = useCallback((idea: BoardIdea): BoardIdea => ({ ...idea, ...patches[idea.id] }), [patches])

  const signIn = useSignIn(lang, member, refreshMember)

  const vote = useCallback(
    async (idea: BoardIdea) => {
      const before = { voted: idea.voted, votes: idea.votes }
      patch(idea.id, { voted: !before.voted, votes: before.votes + (before.voted ? -1 : 1) })
      try {
        patch(idea.id, await (before.voted ? source.unvote(idea.id) : source.vote(idea.id)))
      } catch (error) {
        patch(idea.id, before)
        if (error instanceof IdeasError && error.code === "sign_in_required") refreshMember()
      }
    },
    [patch, source, refreshMember],
  )
  const askVote = useCallback(
    (idea: BoardIdea) => (member ? vote(idea) : signIn.ask("vote", () => vote(idea))),
    [member, vote, signIn],
  )

  const select = useCallback((id: string | null) => smoothly(() => setSelected(id)), [])
  const retry = useCallback(() => setAttempt((count) => count + 1), [])

  return {
    lang,
    source,
    query,
    setQuery,
    search,
    setSearch: setSearchState,
    clear,
    filtered: !!(query.tool || query.status || query.tag || query.q),
    list: list && { ...list, ideas: list.ideas.map(view) },
    pending,
    failed,
    retry,
    tags,
    selected,
    select,
    view,
    patch,
    member,
    vote: askVote,
    signIn,
    addPosted: (idea: BoardIdea) =>
      smoothly(() => setList((before) => before && { ideas: [idea, ...before.ideas], total: before.total + 1 })),
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
      // In the sample the pop-up has its own session storage, so this window takes the signed-in state itself.
      setPreviewMode("signed-in")
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

  const google = () => {
    setError("")
    const url = sampleSource.googleSignInUrl(asLocale(lang), popupReturnPath(lang))
    const width = 480
    const height = 640
    const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2)
    const top = window.screenY + Math.max(0, (window.outerHeight - height) / 3)
    popup.current = window.open(url, "wirecat-sign-in", `popup,width=${width},height=${height},left=${left},top=${top}`)
    if (!popup.current) return setState("blocked")
    setState("waiting")
  }

  const sendLink = async (email: string, turnstileToken: string) => {
    setError("")
    try {
      await sampleSource.requestSignInLink({
        email,
        locale: asLocale(lang),
        returnTo: `${window.location.pathname}${window.location.search}`,
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

/** One idea with its comments, loaded when it opens. */
export function useIdeaThread(board: Board, id: string | null) {
  const [idea, setIdea] = useState<BoardIdea | null>()
  const [comments, setComments] = useState<Comment[]>()
  const [failed, setFailed] = useState(false)
  const { source } = board

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only a new id starts a load, list updates reach it through board.view.
  useEffect(() => {
    if (!id) return
    let current = true
    const known = board.list?.ideas.find((item) => item.id === id)
    setIdea(known)
    setComments(undefined)
    setFailed(false)
    if (!known)
      source.get(id).then(
        (found) => current && setIdea(found),
        () => current && setIdea(null),
      )
    source.comments(id).then(
      (found) => current && setComments(found),
      () => current && setFailed(true),
    )
    return () => {
      current = false
    }
  }, [id, source])

  const add = async (body: string) => {
    if (!id) return
    const comment = await source.addComment(id, body)
    setComments((before) => [...(before ?? []), comment])
    const base = idea && board.view(idea)
    if (base) board.patch(id, { commentsCount: base.commentsCount + 1 })
  }

  return { idea: idea && board.view(idea), comments, failed, add }
}

/** The new-idea form's state, shared so each variant only lays it out. */
export function useComposer(board: Board, onPosted: (idea: BoardIdea) => void) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tool, setTool] = useState<IdeaTool | "">("")
  const [tags, setTags] = useState<string[]>([])
  const [similar, setSimilar] = useState<BoardIdea[]>([])
  const [token, setToken] = useState("")
  const [resetKey, setResetKey] = useState(0)
  const [checked, setChecked] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const { source, lang } = board

  useEffect(() => {
    if (title.trim().length < 4) return setSimilar([])
    let current = true
    const timer = setTimeout(() => {
      source.similar(title).then(
        (found) => current && setSimilar(found),
        () => current && setSimilar([]),
      )
    }, 250)
    return () => {
      current = false
      clearTimeout(timer)
    }
  }, [title, source])

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
      const idea = await source.create({ title: title.trim(), body: body.trim(), tool, tags, turnstileToken: token })
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

export const sortLabel = (lang: string, sort: BoardSort) => boardWords(lang).sorts[sort]
