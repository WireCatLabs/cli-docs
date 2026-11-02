export const ideaTools = ["tg", "max", "wa", "mail", "gcal", "drive", "zm", "memo", "desktop", "other"] as const
export const ideaStatuses = ["new", "planned", "in_progress", "done", "not_planned"] as const
export const ideaSorts = ["top", "trending", "new"] as const
export const maxTags = 3
export const locales = ["en", "ru", "es"] as const

export type IdeaTool = (typeof ideaTools)[number]
export type IdeaStatus = (typeof ideaStatuses)[number]
export type IdeaSort = (typeof ideaSorts)[number]
export type Locale = (typeof locales)[number]

export type IdeaLink = { label: string; url: string }
/** The owner's tags, named in every site language; show `name[locale]`. */
export type Tag = { slug: string; name: Record<Locale, string> }
export type Author = { name: string | null; team: boolean }
export type Comment = { id: string; body: string; hidden: boolean; mine: boolean; author: Author; createdAt: string }

export type Idea = {
  id: string
  title: string
  body: string
  tool: IdeaTool
  status: IdeaStatus
  /** set only for not_planned */
  statusReason: string | null
  answer: string | null
  links: IdeaLink[]
  votes: number
  voted: boolean
  tags: Tag[]
  commentsCount: number
  /** name is null for a member with no name or a deleted account; team marks the seeded ideas */
  author: Author
  mergedIntoId: string | null
  statusChangedAt?: string | null
  createdAt: string
}

export type Member = { email: string; name: string | null }

export type IdeaQuery = {
  tool?: IdeaTool
  status?: IdeaStatus
  tag?: string
  /** 3 to 120 characters, every word a prefix match; shorter is not sent */
  q?: string
  sort: IdeaSort
  page?: number
  perPage?: number
}
export type IdeaPage = { ideas: Idea[]; total: number; page: number; perPage: number }
export type NewIdea = { title: string; body: string; tool: IdeaTool; tags: string[]; turnstileToken: string }
export type SignInLink = { email: string; locale: Locale; returnTo: string; turnstileToken: string }

/**
 * Every failure the screens tell apart, from the API's `error.code` (docs/ideas-api.md, "Errors"). `unavailable`
 * covers no answer at all and server errors, and shows as the "API down" state.
 */
export type IdeasErrorCode =
  | "unavailable"
  | "sign_in_required"
  | "sign_in_unavailable"
  | "turnstile_failed"
  | "already_voted"
  | "not_voted"
  | "not_found"
  | "idea_merged"
  | "validation_error"
  | "invalid_token"
  | "idea_limit"
  | "comment_limit"
  | "not_comment_author"
  | "merge_refused"
  | "rate_limited"
  | "forbidden"

export class IdeasError extends Error {
  constructor(
    readonly code: IdeasErrorCode,
    message: string = code,
    readonly fields: Record<string, string[]> = {},
  ) {
    super(message)
  }
}

/** The screens' view of `docs/ideas-api.md` in wirecat-api. The sample source and the API client both implement it. */
export type IdeasSource = {
  list(query: IdeaQuery): Promise<IdeaPage>
  get(id: string): Promise<Idea | null>
  similar(title: string): Promise<Idea[]>
  tags(): Promise<Tag[]>
  create(idea: NewIdea): Promise<Idea>
  comments(ideaId: string): Promise<Comment[]>
  addComment(ideaId: string, body: string, turnstileToken: string): Promise<Comment>
  deleteComment(ideaId: string, commentId: string): Promise<void>
  vote(id: string): Promise<Pick<Idea, "voted" | "votes">>
  unvote(id: string): Promise<Pick<Idea, "voted" | "votes">>
  member(): Promise<Member | null>
  requestSignInLink(link: SignInLink): Promise<void>
  googleSignInUrl(locale: Locale, returnTo: string): string
  /** Throws `sign_in_unavailable` while Google sign-in is not set up, before the page navigates away to it. */
  googleSignInReady(locale: Locale, returnTo: string): Promise<void>
  /** Trades the emailed token for a session and gives where to go next. */
  startSession(token: string): Promise<{ returnTo: string | null }>
  signOut(): Promise<void>
  deleteAccount(): Promise<void>
  unsubscribe(token: string): Promise<void>
}

export const isTool = (value: string | null | undefined): value is IdeaTool => ideaTools.includes(value as IdeaTool)
export const isStatus = (value: string | null | undefined): value is IdeaStatus =>
  ideaStatuses.includes(value as IdeaStatus)
export const isSort = (value: string | null | undefined): value is IdeaSort => ideaSorts.includes(value as IdeaSort)
export const tagName = (tag: Tag, lang: string) => tag.name[asLocale(lang)] || tag.name.en || tag.slug
export const asLocale = (value: string): Locale => (locales.includes(value as Locale) ? (value as Locale) : "en")
