import { beforeEach, describe, expect, it, vi } from "vitest"
import { sampleIdeas } from "../lib/ideas/sample-data.ts"
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
  })

  it("declines Russian counts", () => {
    const { count } = ideasWords("ru")
    expect([1, 3, 5, 11, 21, 22].map(count)).toEqual(["1 идея", "3 идеи", "5 идей", "11 идей", "21 идея", "22 идеи"])
  })

  it("keeps the sample ideas in the voice too", () => {
    const text = sampleIdeas.flatMap((idea) => [idea.title, idea.body, idea.answer ?? ""])
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
    const zoom = await settle(sampleSource.list({ tool: "zm", sort: "top" }))
    expect(zoom.every((idea) => idea.tool === "zm")).toBe(true)
    expect(zoom.map((idea) => idea.votes)).toEqual([...zoom.map((idea) => idea.votes)].sort((a, b) => b - a))
    expect(await settle(sampleSource.list({ tool: "wa", status: "done", sort: "top" }))).toEqual([])
  })

  it("counts a vote once and takes it back", async () => {
    const { sampleSource, setPreviewMode } = await import("../lib/ideas/sample.ts")
    setPreviewMode("signed-in")
    const [first] = await settle(sampleSource.list({ sort: "top" }))
    const voted = await settle(sampleSource.vote(first.id))
    expect(voted).toMatchObject({ voted: true, votes: first.votes + 1 })
    expect(await settle(sampleSource.vote(first.id))).toMatchObject({ votes: first.votes + 1 })
    expect(await settle(sampleSource.unvote(first.id))).toMatchObject({ voted: false, votes: first.votes })
  })

  it("suggests similar ideas by shared words", async () => {
    const { sampleSource } = await import("../lib/ideas/sample.ts")
    const similar = await settle(sampleSource.similar("search zoom meetings by speaker"))
    expect(similar.length).toBeGreaterThan(0)
    expect(similar.length).toBeLessThanOrEqual(4)
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
