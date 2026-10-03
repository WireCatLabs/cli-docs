import { describe, expect, it } from "vitest"
import { isGettingStarted, messengerHref } from "../lib/docs-navigation"

const pages = ["tg", "tg/installation", "tg/mcp", "max", "max/installation", "max/mcp", "max/bot"]

describe("switching documentation messengers", () => {
  it("keeps a section shared by both tools in the current language", () => {
    expect(messengerHref("/ru/docs/tg/installation", "ru", "max", pages)).toBe("/ru/docs/max/installation")
    expect(messengerHref("/es/docs/max/mcp", "es", "tg", pages)).toBe("/es/docs/tg/mcp")
  })

  it("falls back to the target overview for a tool-specific section", () => {
    expect(messengerHref("/en/docs/max/bot", "en", "tg", pages)).toBe("/en/docs/tg")
  })

  it("opens the chosen messenger from a shared guide or the docs index", () => {
    expect(messengerHref("/en/docs/agents", "en", "max", pages)).toBe("/en/docs/max")
    expect(messengerHref("/ru/docs", "ru", "tg", pages)).toBe("/ru/docs/tg")
  })
})

describe("getting-started navigation state", () => {
  it("selects Getting started for every shared guide and locale", () => {
    for (const lang of ["en", "ru", "es"]) {
      for (const section of ["", "/installation", "/agents", "/mcp"]) {
        expect(isGettingStarted(`/${lang}/docs${section}`)).toBe(true)
        expect(isGettingStarted(`/${lang}/docs${section}/`)).toBe(true)
      }
    }
  })
  it("does not select Getting started for messenger guides or other routes", () => {
    for (const path of ["/ru/docs/tg/installation", "/en/docs/max/mcp", "/en/about", "/ru/docs/installation-extra"])
      expect(isGettingStarted(path)).toBe(false)
  })
})
