import {
  type Comment,
  type Idea,
  type IdeaQuery,
  IdeasError,
  type IdeasErrorCode,
  type IdeasSource,
  isStatus,
  isTool,
  type Member,
  type Tag,
} from "./types"

export const perPage = 20

type ApiIdea = {
  id: number | string
  title: string
  body: string | null
  tool: string
  status: string
  status_reason: string | null
  answer: string | null
  links: { url: string; label: string }[] | null
  votes_count: number
  comments_count?: number
  tags?: ApiTag[] | null
  voted: boolean
  merged_into_id: number | string | null
  status_changed_at?: string | null
  author: { name: string | null; team: boolean } | null
  created_at: string
}
type ApiTag = { slug: string; name: Partial<Tag["name"]> | string }
type ApiComment = {
  id: number | string
  body: string
  hidden?: boolean
  mine?: boolean
  author: { name: string | null; team: boolean } | null
  created_at: string
}
type ApiError = { error?: { code?: string; message?: string; fields?: Record<string, string[]> } }

export const fromApiTag = ({ slug, name }: ApiTag): Tag => {
  const names = typeof name === "string" ? { en: name } : (name ?? {})
  const fallback = names.en ?? slug
  return { slug, name: { en: fallback, ru: names.ru ?? fallback, es: names.es ?? fallback } }
}

export const fromApiComment = (comment: ApiComment): Comment => ({
  id: String(comment.id),
  body: comment.body,
  hidden: comment.hidden ?? false,
  mine: comment.mine ?? false,
  author: { name: comment.author?.name ?? null, team: comment.author?.team ?? false },
  createdAt: comment.created_at,
})

export const fromApi = (idea: ApiIdea): Idea => ({
  id: String(idea.id),
  title: idea.title,
  body: idea.body ?? "",
  tool: isTool(idea.tool) ? idea.tool : "other",
  status: isStatus(idea.status) ? idea.status : "new",
  statusReason: idea.status_reason ?? null,
  answer: idea.answer ?? null,
  links: idea.links ?? [],
  votes: idea.votes_count,
  voted: idea.voted,
  tags: (idea.tags ?? []).map(fromApiTag),
  commentsCount: idea.comments_count ?? 0,
  author: { name: idea.author?.name ?? null, team: idea.author?.team ?? false },
  mergedIntoId: idea.merged_into_id == null ? null : String(idea.merged_into_id),
  statusChangedAt: idea.status_changed_at ?? null,
  createdAt: idea.created_at,
})

const mergeRefusals = ["same_idea", "already_merged", "duplicate_is_hidden", "kept_is_merged", "kept_is_hidden"]

/** One HTTP status and API code to the few failures the screens tell apart. */
export function errorCode(status: number, code = ""): IdeasErrorCode {
  if (code === "mail_unavailable" || code === "google_unavailable") return "sign_in_unavailable"
  if (status >= 500) return "unavailable"
  if (status === 401) return "sign_in_required"
  if (status === 403) {
    if (code === "turnstile_failed") return "turnstile_failed"
    return code === "not_comment_author" ? "not_comment_author" : "forbidden"
  }
  if (status === 404) return code === "not_voted" ? "not_voted" : "not_found"
  if (status === 409) return "already_voted"
  if (status === 422) {
    if (code === "idea_merged") return "idea_merged"
    if (code === "invalid_sign_in_token" || code === "invalid_unsubscribe_token") return "invalid_token"
    if (mergeRefusals.includes(code)) return "merge_refused"
    return "validation_error"
  }
  if (status === 429) {
    if (code === "idea_limit" || code === "comment_limit") return code as IdeasErrorCode
    return "rate_limited"
  }
  return "unavailable"
}

/** The browser client for `docs/ideas-api.md`; the session is an HttpOnly cookie, so every call sends credentials. */
export function apiSource(base: string, fetcher: typeof fetch = (...args) => fetch(...args)): IdeasSource {
  const root = base.replace(/\/$/, "")

  async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
    let response: Response
    try {
      response = await fetcher(`${root}${path}`, {
        method,
        credentials: "include",
        headers: body === undefined ? undefined : { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      })
    } catch {
      throw new IdeasError("unavailable")
    }
    const text = await response.text().catch(() => "")
    let json: unknown = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {}
    if (!response.ok) {
      const error = (json as ApiError | null)?.error
      throw new IdeasError(errorCode(response.status, error?.code), error?.message, error?.fields)
    }
    return json as T
  }

  const query = (params: Record<string, string | number | undefined>) => {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) if (value !== undefined) search.set(key, String(value))
    return search.toString()
  }
  const id = (value: string) => encodeURIComponent(value)
  const votes = ({ idea }: { idea: Pick<ApiIdea, "votes_count" | "voted"> }) => ({
    votes: idea.votes_count,
    voted: idea.voted,
  })

  return {
    async list({ tool, status, tag, q, sort, page = 1, perPage: size = perPage, voted }: IdeaQuery) {
      const search = q?.trim().slice(0, 120)
      const result = await call<{ ideas: ApiIdea[]; meta: { page: number; per_page: number; total: number } }>(
        "GET",
        `/v1/ideas?${query({ tool, status, tag, q: search && search.length >= 3 ? search : undefined, sort, page, per_page: size, voted: voted ? "true" : undefined })}`,
      )
      return {
        ideas: result.ideas.map(fromApi),
        total: result.meta.total,
        page: result.meta.page,
        perPage: result.meta.per_page,
      }
    },
    async get(ideaId) {
      try {
        return fromApi((await call<{ idea: ApiIdea }>("GET", `/v1/ideas/${id(ideaId)}`)).idea)
      } catch (error) {
        if (error instanceof IdeasError && error.code === "not_found") return null
        throw error
      }
    },
    async similar(title) {
      const q = title.trim().slice(0, 120)
      if (q.length < 3) return []
      return (await call<{ ideas: ApiIdea[] }>("GET", `/v1/ideas/similar?${query({ q })}`)).ideas.map(fromApi)
    },
    tags: async () => (await call<{ tags: ApiTag[] }>("GET", "/v1/tags")).tags.map(fromApiTag),
    async create({ title, body, tool, tags, turnstileToken }) {
      const result = await call<{ idea: ApiIdea }>("POST", "/v1/ideas", {
        idea: { title, body, tool, tags },
        turnstile_token: turnstileToken,
      })
      return fromApi(result.idea)
    },
    async comments(ideaId) {
      const all: Comment[] = []
      for (let page = 1; page <= 10; page++) {
        const result = await call<{ comments: ApiComment[]; meta: { total: number } }>(
          "GET",
          `/v1/ideas/${id(ideaId)}/comments?${query({ page, per_page: 50 })}`,
        )
        for (const comment of result.comments) all.push(fromApiComment(comment))
        if (all.length >= result.meta.total || !result.comments.length) break
      }
      return all
    },
    async addComment(ideaId, body, turnstileToken) {
      const result = await call<{ comment: ApiComment }>("POST", `/v1/ideas/${id(ideaId)}/comments`, {
        comment: { body },
        turnstile_token: turnstileToken,
      })
      return fromApiComment(result.comment)
    },
    deleteComment: async (ideaId, commentId) => {
      await call("DELETE", `/v1/ideas/${id(ideaId)}/comments/${id(commentId)}`)
    },
    vote: async (ideaId) => votes(await call("POST", `/v1/ideas/${id(ideaId)}/vote`)),
    unvote: async (ideaId) => votes(await call("DELETE", `/v1/ideas/${id(ideaId)}/vote`)),
    async member() {
      try {
        const { member } = await call<{ member: Member }>("GET", "/v1/sessions")
        return { email: member.email, name: member.name ?? null }
      } catch (error) {
        if (error instanceof IdeasError && error.code === "sign_in_required") return null
        throw error
      }
    },
    async requestSignInLink({ email, locale, returnTo, turnstileToken }) {
      await call("POST", "/v1/sign_in_links", {
        sign_in_link: { email, locale, return_to: returnTo },
        turnstile_token: turnstileToken,
      })
    },
    googleSignInUrl: (locale, returnTo) => `${root}/v1/google_sign_ins/new?${query({ locale, return_to: returnTo })}`,
    // `redirect: "manual"` stops at the API's redirect to Google, so only a refusal gets read.
    async googleSignInReady(locale, returnTo) {
      let response: Response
      try {
        response = await fetcher(`${root}/v1/google_sign_ins/new?${query({ locale, return_to: returnTo })}`, {
          credentials: "include",
          redirect: "manual",
        })
      } catch {
        throw new IdeasError("unavailable")
      }
      if (response.type === "opaqueredirect" || response.ok || (response.status >= 300 && response.status < 400)) return
      const error = ((await response.json().catch(() => null)) as ApiError | null)?.error
      throw new IdeasError(errorCode(response.status, error?.code), error?.message)
    },
    async startSession(token) {
      const result = await call<{ return_to?: string | null }>("POST", "/v1/sessions", { token })
      return { returnTo: result?.return_to ?? null }
    },
    signOut: () => call("DELETE", "/v1/sessions"),
    deleteAccount: () => call("DELETE", "/v1/member"),
    unsubscribe: (token) => call("DELETE", "/v1/subscriptions", { token }),
  }
}
