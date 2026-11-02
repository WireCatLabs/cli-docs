import { beforeEach, describe, expect, it, vi } from "vitest"
import { boardWords } from "../lib/ideas/board-words.ts"
import { sampleComments, sampleIdeas } from "../lib/ideas/sample-data.ts"
import { ideaStatuses, ideaTools } from "../lib/ideas/types.ts"
import { ideasWords } from "../lib/ideas/words.ts"

const strings = (value: unknown): string[] => {
  if (typeof value === "string") return [value]
  if (typeof value === "function") return [String(value(3, "x")), String(value(1, "x"))]
  if (value && typeof value === "object") return Object.values(value).flatMap(strings)
  return []
}

describe("ideas copy", () => {
  it.each(["en", "ru", "es"])("has every tool and status in %s, with no semicolons or long dashes", (lang) => {
    const words = ideasWords(lang)
    for (const tool of ideaTools) expect(words.tools[tool]).toBeTruthy()
    for (const status of ideaStatuses) expect(words.statuses[status]).toBeTruthy()
    expect(strings(words).filter((text) => /[;—–]/.test(text))).toEqual([])
    expect(strings(boardWords(lang)).filter((text) => /[;—–]/.test(text))).toEqual([])
  })

  it("declines Russian counts", () => {
    const { count } = ideasWords("ru")
    expect([1, 3, 5, 11, 21, 22].map(count)).toEqual(["1 идея", "3 идеи", "5 идей", "11 идей", "21 идея", "22 идеи"])
  })

  it("keeps the sample ideas in the voice too", () => {
    const text = [
      ...sampleIdeas.flatMap((idea) => [idea.title, idea.body, idea.answer ?? ""]),
      ...Object.values(sampleComments).flatMap((comments) => comments.map((comment) => comment.body)),
    ]
    expect(text.filter((line) => /[;—–]/.test(line))).toEqual([])
  })
})

describe("sample source", () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    vi.stubGlobal("window", { location: { search: "" } })
    vi.stubGlobal("sessionStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
    })
    vi.useFakeTimers()
  })

  const settle = async <T>(promise: Promise<T>) => {
    await vi.runAllTimersAsync()
    return promise
  }

  it("filters by tool and status and sorts by votes", async () => {
    const { sampleSource } = await import("../lib/ideas/sample.ts")
    const { ideas: zoom } = await settle(sampleSource.list({ tool: "zm", sort: "top" }))
    expect(zoom.every((idea) => idea.tool === "zm")).toBe(true)
    expect(zoom.map((idea) => idea.votes)).toEqual([...zoom.map((idea) => idea.votes)].sort((a, b) => b - a))
    expect((await settle(sampleSource.list({ tool: "wa", status: "done", sort: "top" }))).total).toBe(0)
  })

  it("counts a vote once and takes it back", async () => {
    const { sampleSource, setPreviewMode } = await import("../lib/ideas/sample.ts")
    setPreviewMode("signed-in")
    const {
      ideas: [first],
    } = await settle(sampleSource.list({ sort: "top" }))
    const voted = await settle(sampleSource.vote(first.id))
    expect(voted).toMatchObject({ voted: true, votes: first.votes + 1 })
    expect(await settle(sampleSource.vote(first.id))).toMatchObject({ votes: first.votes + 1 })
    expect(await settle(sampleSource.unvote(first.id))).toMatchObject({ voted: false, votes: first.votes })
  })

  it("suggests similar ideas by shared words", async () => {
    const { sampleSource } = await import("../lib/ideas/sample.ts")
    const similar = await settle(sampleSource.similar("search zoom meetings by speaker"))
    expect(similar.length).toBeGreaterThan(0)
    expect(similar.length).toBeLessThanOrEqual(5)
  })

  it("filters by tag, searches by word prefixes and sorts by trending", async () => {
    const { sampleSource } = await import("../lib/ideas/sample.ts")
    const { ideas: tagged } = await settle(sampleSource.list({ tag: "privacy", sort: "top" }))
    expect(tagged.length).toBeGreaterThan(0)
    expect(tagged.every((idea) => idea.tags.some((tag) => tag.slug === "privacy"))).toBe(true)
    const { ideas: found } = await settle(sampleSource.list({ q: "spea transcr", sort: "top" }))
    expect(found.map((idea) => idea.id)).toEqual(["speaker-names-in-transcripts"])
    const { total } = await settle(sampleSource.list({ sort: "trending" }))
    expect(total).toBe(sampleIdeas.length)
  })

  it("adds a comment, counts it and deletes only your own", async () => {
    const { sampleSource, setPreviewMode } = await import("../lib/ideas/sample.ts")
    setPreviewMode("signed-in")
    const id = "notion"
    const before = await settle(sampleSource.comments(id))
    const added = await settle(sampleSource.addComment(id, "Read-only is enough.", "t"))
    expect(added).toMatchObject({ mine: true, body: "Read-only is enough." })
    expect((await settle(sampleSource.get(id)))?.commentsCount).toBe(before.length + 1)
    const failed = expect(sampleSource.deleteComment(id, before[0].id)).rejects.toThrow()
    await vi.runAllTimersAsync()
    await failed
    await settle(sampleSource.deleteComment(id, added.id))
    expect(await settle(sampleSource.comments(id))).toHaveLength(before.length)
  })

  it("fails every call but the session in the API-down preview", async () => {
    const { sampleSource, setPreviewMode } = await import("../lib/ideas/sample.ts")
    setPreviewMode("down")
    const failed = expect(sampleSource.list({ sort: "top" })).rejects.toThrow()
    await vi.runAllTimersAsync()
    await failed
    expect(await sampleSource.member()).not.toBeNull()
  })
})
