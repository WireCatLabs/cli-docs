import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  contentLanguage,
  correctDocumentation,
  fingerprint,
  localizeTool,
  siteLinks,
  translationProblems,
  withOriginalAnchors,
} from "./localize.ts"

describe("released documentation translations", () => {
  const original =
    '---\ntitle: "Login"\n---\n\n## Profiles\n\nKeep `TG_PROFILE` and [sessions](./sessions.md#profiles).\n\n```sh\ntg work inbox # original comment\n```\n'
  const translated =
    '---\ntitle: "Вход"\n---\n\n## Профили\n\nСохраните `TG_PROFILE` и [вход](./sessions.md#profiles).\n\n```sh\ntg work inbox # original comment\n```\n'

  it("retains incoming section links when translated headings get new slugs", () => {
    expect(withOriginalAnchors(original, translated)).toContain('<a id="profiles" />\n\n## Профили')
    expect(translationProblems(original, translated)).toEqual([])
  })
  it("rejects changed commands, literals, destinations and missing sections", () => {
    expect(translationProblems(original, translated.replace("tg work inbox", "tg inbox"))).toContain(
      "Code blocks changed",
    )
    expect(translationProblems(original, translated.replace("TG_PROFILE", "PROFILE"))).toContain("Inline code changed")
    expect(translationProblems(original, translated.replace("#profiles", "#профили"))).toContain(
      "Link destinations changed",
    )
    expect(translationProblems(original, translated.replace("## Профили\n", ""))).toContain("Heading structure changed")
  })
  it("validates multiline inline commands and keeps literal underscores in anchors", () => {
    expect(
      translationProblems(
        "Use `conversations links\nadd --batch <id>`.",
        "Используйте `conversations links\nadd --batch <id>`.",
      ),
    ).toEqual([])
    expect(withOriginalAnchors("## `outcome_unknown` after sending", "## `outcome_unknown` после отправки")).toContain(
      'id="outcome_unknown-after-sending"',
    )
  })
  it("marks the actual content language, including untranslated fallbacks", () => {
    expect(contentLanguage(original, "en")).toContain('contentLanguage: "en"')
  })
  it("opens a site page named by its full URL in the reader's language", () => {
    const page = "[shared page](https://wirecat.dev/ru/docs/security) · `https://wirecat.dev/ru/docs/x`"
    expect(siteLinks(page, "es")).toBe("[shared page](/es/docs/security) · `https://wirecat.dev/ru/docs/x`")
  })
  it("applies reviewed errata exactly once and rejects stale or ambiguous corrections", () => {
    const correction = [{ before: "old claim", after: "reviewed claim" }]
    expect(correctDocumentation("An old claim.", correction)).toBe("An reviewed claim.")
    expect(() => correctDocumentation("new claim", correction)).toThrow()
    expect(() => correctDocumentation("old claim; old claim", correction)).toThrow()
  })
  it("parses nested backticks and fenced examples inside lists without treating prose as code", () => {
    const before = "Use `` `code` ``.\n\n1. Run:\n\n   ```sh\n   max inbox\n   ```\n\nRead [help](./usage.md)."
    const after =
      "Используйте `` `code` ``.\n\n1. Запустите:\n\n   ```sh\n   max inbox\n   ```\n\nОткройте [справку](./usage.md)."
    expect(translationProblems(before, after)).toEqual([])
    expect(translationProblems(before, after.replace("max inbox", "max chats list"))).toContain("Code blocks changed")
  })
  it("requires review on content changes but ignores rewritten release link tags", () => {
    expect(fingerprint(original)).not.toBe(fingerprint(original.replace("Profiles", "Accounts")))
    expect(fingerprint("https://github.com/org/repo/blob/v1.2.3/docs/x.md")).toBe(
      fingerprint("https://github.com/org/repo/blob/v1.3.0/docs/x.md"),
    )
  })
  it("does not accept a stale Spanish translation when only Russian has been reviewed", () => {
    const root = mkdtempSync(join(tmpdir(), "wirecat-locales-"))
    try {
      for (const path of ["content/upstream/tg", "content/docs/tg", "translations/tg"])
        mkdirSync(join(root, path), { recursive: true })
      writeFileSync(join(root, "content/upstream/tg/login.md"), original)
      writeFileSync(join(root, "content/upstream/tg/meta.json"), JSON.stringify({ title: "tg", pages: ["login"] }))
      writeFileSync(join(root, "translations/tg/login.ru.md"), translated)
      writeFileSync(join(root, "translations/tg/login.es.md"), translated.replace("Вход", "Acceso"))
      writeFileSync(
        join(root, "translations/sources.json"),
        JSON.stringify({ "tg/login.ru": fingerprint(original), "tg/login.es": fingerprint("old release") }),
      )
      expect(localizeTool(root, { name: "tg", lang: "en" })).toEqual([
        "tg/login.es: source changed; translation needs review",
      ])
      expect(readFileSync(join(root, "content/docs/tg/login.ru.md"), "utf8")).toContain('contentLanguage: "ru"')
      expect(readFileSync(join(root, "content/docs/tg/login.es.md"), "utf8")).toContain('contentLanguage: "en"')
    } finally {
      rmSync(root, { recursive: true, force: true })
    }
  })
})
