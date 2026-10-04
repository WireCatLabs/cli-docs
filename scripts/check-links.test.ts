import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { linkProblems, markdownLinkProblems } from "./check-links.ts"

describe("linkProblems", () => {
  let out: string
  const write = (path: string, html: string) => {
    mkdirSync(dirname(join(out, path)), { recursive: true })
    writeFileSync(join(out, path), html)
  }
  beforeEach(() => {
    out = mkdtempSync(join(tmpdir(), "links-"))
  })
  afterEach(() => rmSync(out, { recursive: true, force: true }))

  it("follows a percent-encoded Russian anchor to its heading", () => {
    write("en/docs/max/archive.html", '<h2 id="скачать-историю">Скачать историю</h2>')
    write(
      "en/docs/max/usage.html",
      '<a href="/en/docs/max/archive#%D1%81%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C-%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8E">x</a>',
    )
    expect(linkProblems(out)).toEqual([])
  })

  it("names a missing page and a missing heading, and ignores outside links", () => {
    write("en/docs/tg.html", '<h2 id="a">A</h2>')
    write(
      "en/docs/tg/usage.html",
      '<a href="/en/docs/tg/gone">1</a><a href="/en/docs/tg#b">2</a><a href="https://example.com/x">3</a><link href="/en/docs/tg.html?v=1">',
    )
    expect(linkProblems(out)).toEqual([
      "en/docs/tg/usage.html: /en/docs/tg/gone — no such page",
      "en/docs/tg/usage.html: /en/docs/tg#b — no such heading",
    ])
  })

  it("rejects broken exported Markdown paths while ignoring examples inside code", () => {
    write("llms.mdx/docs/agents/content.md", "[Install](./installation.mdx)\n\n```sh\n[x](/not-a-page)\n```\n")
    expect(markdownLinkProblems(out)).toEqual([
      "llms.mdx/docs/agents/content.md: ./installation.mdx — no such page (/llms.mdx/docs/agents/installation.mdx)",
    ])
  })

  it("checks relative, same-document and absolute same-origin HTML links", () => {
    write(
      "en/docs/tg/usage.html",
      '<h2 id="present">A</h2><a href="#present">ok</a><a href="./missing">missing</a><a href="https://wirecat.dev/en/docs/tg/usage#gone">missing anchor</a>',
    )
    expect(linkProblems(out)).toEqual([
      "en/docs/tg/usage.html: ./missing — no such page",
      "en/docs/tg/usage.html: https://wirecat.dev/en/docs/tg/usage#gone — no such heading",
    ])
  })

  it("accepts real Markdown resources, HTML pages and images but rejects directory-only destinations", () => {
    write(
      "llms.mdx/docs/agents/content.md",
      "[Install](/llms.mdx/docs/ru/installation/content.md#вход)\n[HTML](/ru/docs)\n![logo](/favicon.svg)\n[x](https://example.com/page)\n[bad](/folder)\n",
    )
    write("llms.mdx/docs/ru/installation/content.md", "# Установка\n")
    write("ru/docs.html", "<h1>Docs</h1>")
    write("favicon.svg", "<svg></svg>")
    mkdirSync(join(out, "folder"))
    expect(markdownLinkProblems(out)).toEqual(["llms.mdx/docs/agents/content.md: /folder — no such page (/folder)"])
  })

  it("rejects ambiguous HTML anchors and unexpanded installation components", () => {
    write("en/docs/installation.html", '<details id="max"></details><h3 id="max">MAX</h3>')
    write("llms.mdx/docs/installation/content.md", "<InstallationGuide />\n\n```text\n<InstallationGuide />\n```\n")
    expect(linkProblems(out)).toEqual(['en/docs/installation.html: duplicate id "max"'])
    expect(markdownLinkProblems(out)).toEqual([
      "llms.mdx/docs/installation/content.md: InstallationGuide was not expanded for Markdown readers",
    ])
  })

  it("validates Markdown fragments against the corresponding rendered page, including Cyrillic aliases", () => {
    write(
      "llms.mdx/docs/agents/content.md",
      "[Login](/llms.mdx/docs/ru/installation/content.md#%D0%B2%D1%85%D0%BE%D0%B4)\n[Missing](/llms.mdx/docs/ru/installation/content.md#gone)\n",
    )
    write("llms.mdx/docs/ru/installation/content.md", "# Установка (/ru/docs/installation)\n")
    write("ru/docs/installation.html", '<h2 id="вход">Вход</h2>')
    expect(markdownLinkProblems(out)).toEqual([
      "llms.mdx/docs/agents/content.md: /llms.mdx/docs/ru/installation/content.md#gone — no such heading",
    ])
  })
})
