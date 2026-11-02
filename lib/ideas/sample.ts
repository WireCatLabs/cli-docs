import { localeFromPath } from "../site-routes"
import { sampleIdeas } from "./sample-data"
import { type Idea, type IdeaQuery, type IdeasSource, IdeasUnavailable, type Member, type NewIdea } from "./types"

export const previewModes = ["signed-out", "signed-in", "loading", "down"] as const
export type PreviewMode = (typeof previewModes)[number]

const storageKey = "wirecat-ideas-sample"
const sampleMember: Member = { email: "you@example.com", name: "You" }

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
const answer = async <T>(value: () => T, delay = 300): Promise<T> => {
  const { mode } = read()
  if (mode === "loading") return new Promise(() => {})
  await new Promise((resolve) => setTimeout(resolve, delay))
  if (mode === "down") throw new IdeasUnavailable("sample: API down")
  return value()
}

const all = (): Idea[] => {
  const { votes, posted } = read()
  return [...posted, ...sampleIdeas].map((idea) =>
    votes.includes(idea.id) ? { ...idea, voted: true, votes: idea.votes + 1 } : idea,
  )
}

const signedIn = () => read().mode !== "signed-out"

function setVote(id: string, voted: boolean) {
  if (!signedIn()) throw new Error("sign in to vote")
  const saved = read()
  const votes = saved.votes.filter((vote) => vote !== id)
  write({ ...saved, votes: voted ? [...votes, id] : votes })
  const idea = all().find((item) => item.id === id)
  if (!idea) throw new Error(`no idea ${id}`)
  return idea
}

export const sampleSource: IdeasSource = {
  list: ({ tool, status, sort }: IdeaQuery) =>
    answer(() =>
      all()
        .filter((idea) => (!tool || idea.tool === tool) && (!status || idea.status === status))
        .sort((a, b) =>
          sort === "new" ? b.createdAt.localeCompare(a.createdAt) : b.votes - a.votes || a.title.localeCompare(b.title),
        ),
    ),
  get: (id) => answer(() => all().find((idea) => idea.id === id) ?? null),
  similar: (title) =>
    answer(() => {
      const wanted = new Set(words(title))
      if (!wanted.size) return []
      return all()
        .map((idea) => ({ idea, score: words(`${idea.title} ${idea.body}`).filter((word) => wanted.has(word)).length }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || b.idea.votes - a.idea.votes)
        .slice(0, 4)
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
        votes: 1,
        voted: true,
        author: sampleMember.name,
        createdAt: new Date().toISOString(),
        answer: null,
        links: [],
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
  requestSignInLink: () => answer(() => "sent" as const, 600),
  googleSignInUrl: (returnTo) =>
    `/${localeFromPath(returnTo)}/ideas/sign-in?token=google&next=${encodeURIComponent(returnTo)}`,
  exchangeToken: (token) =>
    answer(() => {
      if (token === "expired") return "expired" as const
      setPreviewMode("signed-in")
      return "signed_in" as const
    }, 500),
  signOut: () => answer(() => setPreviewMode("signed-out"), 100),
}
