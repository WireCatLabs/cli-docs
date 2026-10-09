import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

describe("selected editorial production snapshots", () => {
  for (const lang of ["en", "ru", "es"]) {
    it(`${lang}: publishes only selected pages with current search commands and native agent resources`, () => {
      const pages = JSON.parse(readFileSync(`lib/editorial/${lang}.json`, "utf8")) as Record<string, string>
      expect(Object.keys(pages)).toEqual(["home", "features", "examples"])
      const html = Object.values(pages).join("\n")
      expect(html).not.toMatch(/127\.0\.0\.1|localhost|\/block-library|\/studio|\/features-compact/)
      expect(html).not.toMatch(/\b(?:tg|max) messages search\b/)
      expect(pages.examples).toMatch(/tg search messages/)
      expect(pages.examples).toMatch(/max search messages/)
      expect(pages.home).toContain(`href="/${lang}/docs/agents"`)
      expect(pages.home).toContain("<!--email_off-->")
      expect(pages.home).toContain('class="section outcomes5 outcomes5-simple"')
    })
  }
})
