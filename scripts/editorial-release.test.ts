import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

describe("selected editorial production snapshots", () => {
  for (const lang of ["en", "ru", "es"]) {
    it(`${lang}: publishes only selected pages with current search commands and native agent resources`, () => {
      const pages = JSON.parse(readFileSync(`lib/editorial/${lang}.json`, "utf8")) as Record<string, string>
      expect(Object.keys(pages)).toEqual(["home", "features", "examples", "header", "footer"])
      const html = Object.values(pages).join("\n")
      expect(html).not.toMatch(/127\.0\.0\.1|localhost|\/block-library|\/studio|\/features-compact/)
      expect(html).not.toMatch(/\b(?:tg|max)(?: personal)? messages search\b/)
      expect(pages.examples).toMatch(/tg personal search messages/)
      expect(pages.examples).toMatch(/max personal search messages/)
      expect(pages.home).toContain(`href="/${lang}/docs/agents"`)
      expect(pages.footer).toContain('href="/llms.txt"')
      expect(pages.footer).toContain("<!--email_off-->")
      expect(pages.home).toContain('class="section outcomes5 outcomes5-simple"')
    })

    it(`${lang}: offers MAX at the top of the page only in Russian, and the desktop app first`, () => {
      const pages = JSON.parse(readFileSync(`lib/editorial/${lang}.json`, "utf8")) as Record<string, string>
      const hero = pages.home.slice(0, pages.home.indexOf('class="wrap section roles5'))
      const setup = pages.home.slice(pages.home.indexOf('class="wrap section setup"'))
      const demo = [...hero.matchAll(/data-demo-provider="(\w+)"/g)].map((match) => match[1])
      expect(demo).toEqual(lang === "ru" ? ["tg", "max", "wa"] : ["tg", "wa"])
      expect(/\bMAX\b/.test(hero + pages.header)).toBe(lang === "ru")
      expect(setup).toContain('data-connect-provider="max"')
      expect(hero).toContain("Google Calendar</span>")
      expect(hero.match(/data-dialogue-provider="wa"/g)).toHaveLength(4)
      expect(pages.home).not.toMatch(/ru-only/)
      expect(pages.header).toContain(`class="button connect-download" href="/${lang}/download"`)
      const prompt = /<pre class="agent-prompt">([^\n]*)/.exec(pages.home)?.[1]
      expect(prompt).toMatch({ en: /^Install tg/, ru: /^Установи tg/, es: /^Instala tg/ }[lang] as RegExp)
    })
  }
})
