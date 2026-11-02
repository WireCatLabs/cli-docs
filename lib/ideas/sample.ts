import { perPage } from "./api"
import { sampleIdeas } from "./sample-data"
import { type Idea, type IdeaQuery, IdeasError, type IdeasSource, type Member, type NewIdea } from "./types"

export const previewModes = ["signed-out", "signed-in", "loading", "down"] as const
export type PreviewMode = (typeof previewModes)[number]

const storageKey = "wirecat-ideas-sample"
const sampleMember: Member = { email: "you@example.com", name: null }

type Saved = { mode: PreviewMode; votes: string[]; posted: Idea[] }

const read = (): Saved => {
  try {
    const asked = new URLSearchParams(window.location.search).get("preview") as PreviewMode | null
    if (asked && previewModes.includes(asked)) {
      const saved = { votes: [], posted: [], ...JSON.parse(sessionStorage.getItem(storageKey) ?? "{}"), mode: asked }
      sessionStorage.setItem(storageKey, JSON.stringify(saved))
      return saved
    }
    const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null") as Saved | null
    if (saved && previewModes.includes(saved.mode)) return saved
  } catch {}
  return { mode: "signed-out", votes: [], posted: [] }
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
export const answer = async <T>(value: () => T, delay = 300): Promise<T> => {
  const { mode } = read()
  if (mode === "loading") return new Promise(() => {})
  await new Promise((resolve) => setTimeout(resolve, delay))
  if (mode === "down") throw new IdeasError("unavailable")
  return value()
}

export const all = (): Idea[] => {
  const { votes, posted } = read()
  return [...posted, ...sampleIdeas].map((idea) =>
    votes.includes(idea.id) ? { ...idea, voted: true, votes: idea.votes + 1 } : idea,
  )
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
  list: ({ tool, status, sort, page = 1 }: IdeaQuery) =>
    answer(() => {
      const found = all()
        .filter((idea) => (!tool || idea.tool === tool) && (!status || idea.status === status))
        .sort((a, b) =>
          sort === "new" ? b.createdAt.localeCompare(a.createdAt) : b.votes - a.votes || a.title.localeCompare(b.title),
        )
      return { ideas: found.slice((page - 1) * perPage, page * perPage), total: found.length, page, perPage }
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
  create: ({ title, body, tool }: NewIdea) =>
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
  deleteAccount: () => answer(() => write({ mode: "signed-out", votes: [], posted: [] }), 400),
  unsubscribe: (token) =>
    answer(() => {
      if (token === "expired") throw new IdeasError("invalid_token")
    }, 400),
}
