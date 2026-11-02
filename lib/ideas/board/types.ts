import type { Idea, IdeaStatus, IdeaTool, Member } from "../types"

export const boardSorts = ["top", "trending", "new"] as const
export const boardVariants = ["a", "b", "c"] as const
export const maxTags = 3

export type BoardSort = (typeof boardSorts)[number]
export type BoardVariant = (typeof boardVariants)[number]

export type Tag = { slug: string; name: string }
export type Comment = { id: string; body: string; author: { name: string | null; team: boolean }; createdAt: string }
export type BoardIdea = Idea & { tags: Tag[]; commentsCount: number }

export type BoardQuery = { tool?: IdeaTool; status?: IdeaStatus; tag?: string; q?: string; sort: BoardSort }
export type NewBoardIdea = { title: string; body: string; tool: IdeaTool; tags: string[]; turnstileToken: string }

/** The variants' view of the API once comments and tags land (wirecat-api feat/ideas-comments-tags). Sample only. */
export type BoardSource = {
  tags(): Promise<Tag[]>
  list(query: BoardQuery): Promise<{ ideas: BoardIdea[]; total: number }>
  get(id: string): Promise<BoardIdea | null>
  similar(title: string): Promise<BoardIdea[]>
  comments(id: string): Promise<Comment[]>
  addComment(id: string, body: string): Promise<Comment>
  create(idea: NewBoardIdea): Promise<BoardIdea>
  vote(id: string): Promise<Pick<Idea, "voted" | "votes">>
  unvote(id: string): Promise<Pick<Idea, "voted" | "votes">>
  member(): Promise<Member | null>
}

export const isBoardSort = (value: string | null): value is BoardSort => boardSorts.includes(value as BoardSort)
export const isBoardVariant = (value: string | null): value is BoardVariant =>
  boardVariants.includes(value as BoardVariant)
