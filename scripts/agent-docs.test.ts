import { describe, expect, it } from "vitest"
import { inFullText, isSecondaryPage } from "../lib/agent-docs"

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
})
