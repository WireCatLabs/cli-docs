export const ideaTools = ["tg", "max", "wa", "mail", "gcal", "drive", "zm", "memo", "desktop", "all"] as const
export const ideaStatuses = ["new", "planned", "in_progress", "done", "not_planned"] as const
export const ideaSorts = ["top", "new"] as const

export type IdeaTool = (typeof ideaTools)[number]
export type IdeaStatus = (typeof ideaStatuses)[number]
export type IdeaSort = (typeof ideaSorts)[number]

export type IdeaLink = { kind: "release" | "pull_request"; title: string; url: string }

export type Idea = {
  id: string
  title: string
  body: string
  tool: IdeaTool
  status: IdeaStatus
  votes: number
  voted: boolean
  /** null for ideas the WireCat team seeded */
  author: string | null
  createdAt: string
  answer: string | null
  links: IdeaLink[]
}

export type Member = { email: string; name: string }

export type IdeaQuery = { tool?: IdeaTool; status?: IdeaStatus; sort: IdeaSort }
export type NewIdea = { title: string; body: string; tool: IdeaTool; turnstileToken: string }

export type SignInLinkResult = "sent" | "failed"
export type SessionResult = "signed_in" | "expired" | "failed"

/** Thrown when the API cannot be reached or answers with a server error, so screens can show the outage state. */
export class IdeasUnavailable extends Error {}

/**
 * What the screens need from the ideas API (`docs/ideas-api.md` in wirecat-api). The sample source and the
 * API client implement the same shape, so switching is one line in `lib/ideas/index.ts`.
 */
export type IdeasSource = {
  list(query: IdeaQuery): Promise<Idea[]>
  get(id: string): Promise<Idea | null>
  similar(title: string): Promise<Idea[]>
  create(idea: NewIdea): Promise<Idea>
  vote(id: string): Promise<Idea>
  unvote(id: string): Promise<Idea>
  member(): Promise<Member | null>
  requestSignInLink(email: string, turnstileToken: string, returnTo: string): Promise<SignInLinkResult>
  googleSignInUrl(returnTo: string): string
  exchangeToken(token: string): Promise<SessionResult>
  signOut(): Promise<void>
}

export const isTool = (value: string | null | undefined): value is IdeaTool => ideaTools.includes(value as IdeaTool)
export const isStatus = (value: string | null | undefined): value is IdeaStatus =>
  ideaStatuses.includes(value as IdeaStatus)
