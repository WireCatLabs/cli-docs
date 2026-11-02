import { perPage } from "./api"
import { sampleComments, sampleIdeas, sampleTags } from "./sample-data"
import {
  type Comment,
  type Idea,
  type IdeaQuery,
  IdeasError,
  type IdeasSource,
  type Member,
  type NewIdea,
} from "./types"

export const previewModes = ["signed-out", "signed-in", "loading", "down"] as const
export type PreviewMode = (typeof previewModes)[number]

const storageKey = "wirecat-ideas-sample"
const sampleMember: Member = { email: "you@example.com", name: null }

type Saved = {
  mode: PreviewMode
  votes: string[]
  posted: Idea[]
  comments: Record<string, Comment[]>
  deleted: string[]
}

const empty = { votes: [], posted: [], comments: {}, deleted: [] }

const read = (): Saved => {
  try {
    const asked = new URLSearchParams(window.location.search).get("preview") as PreviewMode | null
    if (asked && previewModes.includes(asked)) {
      const saved = { ...empty, ...JSON.parse(sessionStorage.getItem(storageKey) ?? "{}"), mode: asked }
      sessionStorage.setItem(storageKey, JSON.stringify(saved))
      return saved
    }
    const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null") as Saved | null
    if (saved && previewModes.includes(saved.mode)) return { ...empty, ...saved }
  } catch {}
  return { mode: "signed-out", ...empty }
}

const write = (saved: Saved) => {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(saved))
  } catch {}
}

export const previewMode = () => read().mode
export const setPreviewMode = (mode: PreviewMode) => write({ ...read(), mode })

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 2)

/** Waits like a network call would, so the loading states show; the "loading" preview never answers. */
const answer = async <T>(value: () => T, delay = 300): Promise<T> => {
  const { mode } = read()
  if (mode === "loading") return new Promise(() => {})
  await new Promise((resolve) => setTimeout(resolve, delay))
  if (mode === "down") throw new IdeasError("unavailable")
  return value()
}

export const commentsOf = (id: string, saved = read()) =>
  [...(sampleComments[id] ?? []), ...(saved.comments[id] ?? [])].filter((item) => !saved.deleted.includes(item.id))

const all = (): Idea[] => {
  const saved = read()
  return [...saved.posted, ...sampleIdeas].map((idea) => ({
    ...idea,
    ...(saved.votes.includes(idea.id) ? { voted: true, votes: idea.votes + 1 } : {}),
    commentsCount: commentsOf(idea.id, saved).length,
  }))
}

const ageDays = (iso: string) => Math.max(0, (Date.now() - Date.parse(iso)) / 86_400_000)
/** Stands in for the API's "most votes in the last 14 days": young ideas with votes first. */
const trending = (idea: Idea) => idea.votes / (ageDays(idea.createdAt) + 2) ** 1.4

const matches = (idea: Idea, q: string | undefined) => {
  const wanted = q && q.trim().length >= 3 ? words(q) : []
  const text = words(`${idea.title} ${idea.body}`)
  return wanted.every((word) => text.some((have) => have.startsWith(word)))
}

const signedIn = () => read().mode !== "signed-out"

function setVote(id: string, voted: boolean) {
  if (!signedIn()) throw new IdeasError("sign_in_required")
  const saved = read()
  const votes = saved.votes.filter((vote) => vote !== id)
  write({ ...saved, votes: voted ? [...votes, id] : votes })
  const idea = all().find((item) => item.id === id)
  if (!idea) throw new IdeasError("not_found")
  return { voted: idea.voted, votes: idea.votes }
}

/** Preview only: the screens with seeded ideas and no API, switched by the preview bar or `?preview=`. */
export const sampleSource: IdeasSource = {
  list: ({ tool, status, tag, q, sort, page = 1, perPage: size = perPage, voted }: IdeaQuery) =>
    answer(() => {
      const found = all()
        .filter(
          (idea) =>
            (!tool || idea.tool === tool) &&
            (!status || idea.status === status) &&
            (!tag || idea.tags.some((item) => item.slug === tag)) &&
            (!voted || idea.voted) &&
            matches(idea, q),
        )
        .sort((a, b) => {
          if (sort === "new") return b.createdAt.localeCompare(a.createdAt)
          if (sort === "trending") return trending(b) - trending(a) || b.votes - a.votes
          return b.votes - a.votes || a.title.localeCompare(b.title)
        })
      return { ideas: found.slice((page - 1) * size, page * size), total: found.length, page, perPage: size }
    }),
  get: (id) => answer(() => all().find((idea) => idea.id === id) ?? null),
  similar: (title) =>
    answer(() => {
      const wanted = new Set(words(title))
      if (!wanted.size) return []
      return all()
        .map((idea) => ({ idea, score: words(`${idea.title} ${idea.body}`).filter((word) => wanted.has(word)).length }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || b.idea.votes - a.idea.votes)
        .slice(0, 5)
        .map(({ idea }) => idea)
    }, 150),
  tags: () => answer(() => sampleTags, 100),
  comments: (id) => answer(() => commentsOf(id).map((item) => ({ ...item, mine: item.id.startsWith("mine-") })), 250),
  addComment: (id, body) =>
    answer(() => {
      if (!signedIn()) throw new IdeasError("sign_in_required")
      const saved = read()
      const item: Comment = {
        id: `mine-${Date.now()}`,
        body,
        hidden: false,
        mine: true,
        author: { name: sampleMember.name, team: false },
        createdAt: new Date().toISOString(),
      }
      write({ ...saved, comments: { ...saved.comments, [id]: [...(saved.comments[id] ?? []), item] } })
      return item
    }, 350),
  deleteComment: (_id, commentId) =>
    answer(() => {
      if (!commentId.startsWith("mine-")) throw new IdeasError("not_comment_author")
      const saved = read()
      write({ ...saved, deleted: [...saved.deleted, commentId] })
    }, 200),
  create: ({ title, body, tool, tags }: NewIdea) =>
    answer(() => {
      const saved = read()
      const idea: Idea = {
        id: `mine-${Date.now()}`,
        title,
        body,
        tool,
        status: "new",
        statusReason: null,
        answer: null,
        links: [],
        votes: 1,
        voted: true,
        tags: sampleTags.filter((tag) => tags.includes(tag.slug)),
        commentsCount: 0,
        author: { name: sampleMember.name, team: false },
        mergedIntoId: null,
        createdAt: new Date().toISOString(),
      }
      write({
        ...saved,
        posted: [{ ...idea, votes: 0, voted: false }, ...saved.posted],
        votes: [...saved.votes, idea.id],
      })
      return idea
    }, 600),
  vote: (id) => answer(() => setVote(id, true), 200),
  unvote: (id) => answer(() => setVote(id, false), 200),
  // The "down" preview keeps the reader signed in, so the failed vote and post states show too.
  member: async () => {
    if (read().mode === "down") return sampleMember
    return answer(() => (signedIn() ? sampleMember : null), 100)
  },
  requestSignInLink: () => answer(() => undefined, 600),
  googleSignInUrl: (locale, returnTo) => `/${locale}/ideas/sign-in?next=${encodeURIComponent(returnTo)}#token=google`,
  googleSignInReady: () => answer(() => undefined, 100),
  startSession: (token) =>
    answer(() => {
      if (token === "expired") throw new IdeasError("invalid_token")
      setPreviewMode("signed-in")
      return { returnTo: null }
    }, 500),
  signOut: () => answer(() => setPreviewMode("signed-out"), 100),
  deleteAccount: () => answer(() => write({ mode: "signed-out", ...empty }), 400),
  unsubscribe: (token) =>
    answer(() => {
      if (token === "expired") throw new IdeasError("invalid_token")
    }, 400),
}
