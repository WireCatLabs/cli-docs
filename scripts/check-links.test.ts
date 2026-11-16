import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { linkProblems, markdownLinkProblems, sourceLinkProblems } from "./check-links.ts"

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

  it("rejects missing scripts, images and preloaded fonts including Next assets", () => {
    write(
      "index.html",
      '<script src="/_next/static/chunks/missing.js"></script><img src="/missing.png"><link rel="preload" href="/fonts/missing.woff2"><script src="https://external.example/tag.js"></script>',
    )
    expect(linkProblems(out)).toEqual(
      expect.arrayContaining([
        "index.html: /_next/static/chunks/missing.js — missing local asset",
        "index.html: /missing.png — missing local asset",
        "index.html: /fonts/missing.woff2 — missing local asset",
      ]),
    )
  })
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
      "llms.mdx/docs/installation/content.md: Documentation component was not expanded for Markdown readers",
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

describe("sourceLinkProblems", () => {
  let root: string
  const write = (path: string, text: string) => {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), text)
  }
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "source-links-"))
    write("tools.json", JSON.stringify([{ name: "pbx" }]))
    write("translations/pbx/installation.ru.md", "# Установка\n")
    write("translations/overviews/pbx.ru.md", "# Asterisk\n")
    write("content/docs/installation.mdx", "# Installation\n\n## What you need\n")
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  it("rejects a link to a tool page its release removed, though a redirect stub is left (#654)", () => {
    write(
      "public/en/docs/pbx/asterisk/index.html",
      '<meta http-equiv="refresh" content="0; url=/en/docs/pbx/installation">',
    )
    write(
      "content/docs/features.mdx",
      "[connect](./pbx/asterisk.md), [install](./pbx/installation.md#any), [overview](./pbx/index.md)\n",
    )
    expect(sourceLinkProblems(root)).toEqual([
      "content/docs/features.mdx: ./pbx/asterisk.md — no such page (content/docs/pbx/asterisk)",
    ])
  })

  it("checks an authored page's anchors in the same language and links inside translations", () => {
    write("content/docs/installation.ru.mdx", "# Установка\n\n## Что нужно\n")
    write("content/docs/agents.mdx", "[ok](./installation.mdx#what-you-need) [gone](./installation.mdx#gone)\n")
    write("content/docs/agents.ru.mdx", "[ok](./installation.mdx#что-нужно)\n")
    write("translations/pbx/usage.ru.md", "[install](./installation.md) [missing](./asterisk.md)\n")
    expect(sourceLinkProblems(root)).toEqual([
      "content/docs/agents.mdx: ./installation.mdx#gone — no such heading",
      "translations/pbx/usage.ru.md: ./asterisk.md — no such page (content/docs/pbx/asterisk)",
    ])
  })
})
