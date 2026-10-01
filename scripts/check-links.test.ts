import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { linkProblems } from "./check-links.ts"

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
})
