import { describe, expect, it } from "vitest"
import { inFullText, isSecondaryPage, toolSections } from "../lib/agent-docs"
import type { Tool } from "./sync"

describe("agent documentation files", () => {
  it.each([["tg", "changelog"], ["max", "changelog"], ["changelog"]])(
    "keeps %s out of llms-full.txt and lists it as optional in llms.txt",
    (...slugs) => {
      expect(inFullText(slugs)).toBe(false)
      expect(isSecondaryPage(slugs)).toBe(true)
    },
  )

  it("keeps the full command reference once and every guide", () => {
    expect(inFullText(["tg", "commands"])).toBe(true)
    expect(inFullText(["max", "commands-bot"])).toBe(false)
    expect(inFullText(["installation"])).toBe(true)
    expect(inFullText(["tg", "roadmap"])).toBe(true)
  })

  describe("tool sections in llms.txt", () => {
    const tool = (name: string, community?: true): Tool => ({
      name,
      repo: `someone/${name}-cli`,
      package: `@someone/${name}-cli`,
      lang: "en",
      summary: {},
      ...(community ? { community } : {}),
    })
    const section = (t: Tool) => `## ${t.name}`

    it("adds no community heading while no community tool is listed", () => {
      expect(toolSections([tool("tg"), tool("memo")], section)).toEqual(["## tg", "## memo"])
    })

    it("lists community tools under their own heading after ours", () => {
      const sections = toolSections([tool("tg"), tool("acme", true), tool("memo")], section)
      expect(sections.map((block) => block.split("\n")[0])).toEqual([
        "## tg",
        "## memo",
        "## Community tools",
        "## acme",
      ])
    })
  })
})
