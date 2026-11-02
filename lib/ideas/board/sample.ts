import { answer, all as sampleIdeas, sampleSource } from "../sample"
import { asLocale, IdeasError, type Locale } from "../types"
import type { BoardIdea, BoardQuery, BoardSource, Comment, NewBoardIdea, Tag } from "./types"

// Shaped like the API on feat/ideas-comments-tags: tags {slug, name}, ideas with tags[] and comments_count,
// comments {id, body, author {name, team}, created_at}. Names, dates and counts are invented for the screens.
type ApiTag = { slug: string; name: Record<Locale, string> }
type ApiComment = { id: string; body: string; author: { name: string | null; team: boolean }; created_at: string }

const apiTags: ApiTag[] = [
  { slug: "agents", name: { en: "agents", ru: "агенты", es: "agentes" } },
  { slug: "search", name: { en: "search", ru: "поиск", es: "búsqueda" } },
  { slug: "automation", name: { en: "automation", ru: "автоматизация", es: "automatización" } },
  { slug: "privacy", name: { en: "privacy", ru: "приватность", es: "privacidad" } },
  { slug: "sync", name: { en: "sync", ru: "синхронизация", es: "sincronización" } },
  { slug: "media", name: { en: "media", ru: "медиа", es: "multimedia" } },
  { slug: "integrations", name: { en: "integrations", ru: "интеграции", es: "integraciones" } },
  { slug: "setup", name: { en: "setup", ru: "установка", es: "instalación" } },
  { slug: "meetings", name: { en: "meetings", ru: "встречи", es: "reuniones" } },
]

const ideaTags: Record<string, string[]> = {
  "desktop-memory-page": ["agents", "privacy"],
  "see-which-emoji-a-message-got": ["search"],
  "private-notes-on-a-chat": ["privacy"],
  "call-history-and-chat-media": ["media", "search"],
  "press-buttons-on-bot-messages": ["agents", "automation"],
  "pin-archive-and-mute-chats": ["automation"],
  "keep-nothing-on-disk": ["privacy", "sync"],
  "run-my-command-on-a-new-message": ["automation", "agents"],
  "save-files-from-channel-posts": ["media"],
  "outlook-and-microsoft-365-sign-in": ["integrations", "setup"],
  "google-sign-in-without-making-your-own-client": ["setup"],
  "mirror-sync-that-runs-in-the-background": ["sync"],
  "record-calls-i-only-attend": ["meetings", "media"],
  "notes-for-every-meeting": ["meetings", "agents"],
  "speaker-names-in-transcripts": ["meetings", "search"],
  "reviewed-brief-before-a-meeting": ["meetings", "agents"],
  "meetings-in-search-everywhere": ["meetings", "search"],
  "find-pictures-by-the-chat-around-them": ["media", "search"],
  notion: ["integrations"],
  slack: ["integrations"],
  "google-meet-and-microsoft-teams": ["integrations", "meetings"],
  github: ["integrations"],
  "jira-linear-todoist-and-ticktick": ["integrations"],
  "install-without-node": ["setup"],
  "one-timeline-per-person": ["search", "agents"],
  "morning-brief": ["agents", "automation"],
  "who-am-i-waiting-on": ["agents"],
  "what-did-i-promise": ["agents", "search"],
  "forget-one-person-or-chat": ["privacy"],
  "approve-before-an-agent-sends": ["agents", "privacy"],
  "tray-icon-with-sync-status": ["sync"],
  "search-everything-at-once": ["search"],
  "ready-made-agent-skills": ["agents", "automation"],
}

const day = (days: number, hour = 10) => new Date(Date.UTC(2026, 10, 2, hour) - days * 86_400_000).toISOString()
const slava = { name: "Slava", team: true }

const apiComments: Record<string, ApiComment[]> = {
  "press-buttons-on-bot-messages": [
    {
      id: "c1",
      body: "Half my bots are behind inline buttons. Being able to say “press Approve” from the agent would save me a lot of clicks.",
      author: { name: "Marta Ruiz", team: false },
      created_at: day(2, 9),
    },
    {
      id: "c2",
      body: "Same here, mostly for the deploy bot at work. Would it also work for buttons that open a URL?",
      author: { name: "Daniil K.", team: false },
      created_at: day(1, 15),
    },
    {
      id: "c3",
      body: "URL buttons would come back as a link, so the agent can open it or show it to you. Callback buttons get pressed by label. I'll post here when it's in a release.",
      author: slava,
      created_at: day(1, 18),
    },
  ],
  "approve-before-an-agent-sends": [
    {
      id: "c4",
      body: "This is the one thing stopping me from letting the agent answer anything on its own.",
      author: { name: "Alex Chen", team: false },
      created_at: day(4, 11),
    },
    {
      id: "c5",
      body: "+1. A daily limit is nice, but I want to read each message the first week.",
      author: { name: "Irina", team: false },
      created_at: day(3, 8),
    },
  ],
  "speaker-names-in-transcripts": [
    {
      id: "c6",
      body: "Zoom already knows who talks when in the cloud recording, so this should be doable for those.",
      author: { name: "Tom Becker", team: false },
      created_at: day(6, 14),
    },
    {
      id: "c7",
      body: "Right, cloud recordings first. Local ones need a model on your machine, which I'd rather keep optional.",
      author: slava,
      created_at: day(5, 10),
    },
  ],
  "desktop-memory-page": [
    {
      id: "c8",
      body: "Just tried it, finally I can see what my agent saved without opening a terminal. Thanks!",
      author: { name: "Sofia", team: false },
      created_at: day(9, 16),
    },
  ],
  notion: [
    {
      id: "c9",
      body: "Our whole team wiki is in Notion. Read-only would already be enough for me.",
      author: { name: "Pavel M.", team: false },
      created_at: day(1, 12),
    },
  ],
  "morning-brief": [
    {
      id: "c10",
      body: "I do this by hand every morning with three tools. One command would be great.",
      author: { name: "Lena", team: false },
      created_at: day(0, 7),
    },
  ],
}

const commentsKey = "wirecat-ideas-board-sample"
type Saved = { comments: Record<string, ApiComment[]>; tags: Record<string, string[]> }

const read = (): Saved => {
  try {
    return { comments: {}, tags: {}, ...JSON.parse(sessionStorage.getItem(commentsKey) ?? "{}") }
  } catch {
    return { comments: {}, tags: {} }
  }
}
const write = (saved: Saved) => {
  try {
    sessionStorage.setItem(commentsKey, JSON.stringify(saved))
  } catch {}
}

const commentsOf = (id: string) => [...(apiComments[id] ?? []), ...(read().comments[id] ?? [])]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 1)

const ageDays = (iso: string) => Math.max(0, (Date.UTC(2026, 10, 2, 12) - Date.parse(iso)) / 86_400_000)

/** Votes and recent comments, cooled by age, so a young idea with momentum beats an old one with more votes. */
const trending = (idea: BoardIdea) => {
  const recent = commentsOf(idea.id).filter((comment) => ageDays(comment.created_at) < 7).length
  return (idea.votes + 3 * recent) / (ageDays(idea.createdAt) + 2) ** 1.4
}

export function boardSource(lang: string): BoardSource {
  const locale = asLocale(lang)
  const tag = (slug: string): Tag => {
    const found = apiTags.find((item) => item.slug === slug)
    return { slug, name: found ? found.name[locale] : slug }
  }
  const comment = (item: ApiComment): Comment => ({
    id: item.id,
    body: item.body,
    author: item.author,
    createdAt: item.created_at,
  })

  const all = (): BoardIdea[] => {
    const saved = read()
    return sampleIdeas().map((idea) => ({
      ...idea,
      tags: (saved.tags[idea.id] ?? ideaTags[idea.id] ?? []).map(tag),
      commentsCount: commentsOf(idea.id).length,
    }))
  }

  const matches = (idea: BoardIdea, q: string) => {
    const wanted = words(q)
    if (!wanted.length) return true
    const text = words(`${idea.title} ${idea.body} ${idea.tags.map((item) => item.name).join(" ")}`)
    return wanted.every((word) => text.some((have) => have.startsWith(word)))
  }

  return {
    tags: () => answer(() => apiTags.map((item) => tag(item.slug)), 120),
    list: ({ tool, status, tag: wanted, q = "", sort }: BoardQuery) =>
      answer(() => {
        const found = all()
          .filter(
            (idea) =>
              (!tool || idea.tool === tool) &&
              (!status || idea.status === status) &&
              (!wanted || idea.tags.some((item) => item.slug === wanted)) &&
              matches(idea, q),
          )
          .sort((a, b) => {
            if (sort === "new") return b.createdAt.localeCompare(a.createdAt)
            if (sort === "trending") return trending(b) - trending(a)
            return b.votes - a.votes || a.title.localeCompare(b.title)
          })
        return { ideas: found, total: found.length }
      }, 380),
    get: (id) => answer(() => all().find((idea) => idea.id === id) ?? null),
    async similar(title) {
      const wanted = new Set(words(title).filter((word) => word.length > 2))
      if (!wanted.size) return []
      await wait(150)
      return all()
        .map((idea) => ({ idea, score: words(`${idea.title} ${idea.body}`).filter((word) => wanted.has(word)).length }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score || b.idea.votes - a.idea.votes)
        .slice(0, 4)
        .map(({ idea }) => idea)
    },
    comments: (id) => answer(() => commentsOf(id).map(comment), 260),
    async addComment(id, body) {
      const member = await sampleSource.member()
      if (!member) throw new IdeasError("sign_in_required")
      await wait(350)
      const saved = read()
      const item: ApiComment = {
        id: `mine-${Date.now()}`,
        body,
        author: { name: member.name ?? "You", team: false },
        created_at: new Date().toISOString(),
      }
      write({ ...saved, comments: { ...saved.comments, [id]: [...(saved.comments[id] ?? []), item] } })
      return comment(item)
    },
    async create({ tags, ...idea }: NewBoardIdea) {
      const created = await sampleSource.create(idea)
      const saved = read()
      write({ ...saved, tags: { ...saved.tags, [created.id]: tags } })
      return { ...created, tags: tags.map(tag), commentsCount: 0 }
    },
    vote: (id) => sampleSource.vote(id),
    unvote: (id) => sampleSource.unvote(id),
    member: () => sampleSource.member(),
  }
}
