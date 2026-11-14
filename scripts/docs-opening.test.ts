import { execFileSync } from "node:child_process"
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it, onTestFinished } from "vitest"
import { changedPages, openingFindings, pageFindings, styleFindings } from "./docs-opening.ts"

const sections = (count: number) => Array.from({ length: count }, (_, i) => `## Part ${i + 1}\n\nText.\n`).join("\n")
const contents = (count: number, label = "On this page:") =>
  `**${label}**\n\n${Array.from({ length: count }, (_, i) => `${i + 1}. [Part ${i + 1}](#part-${i + 1})`).join("\n")}\n`
const rulesOf = (file: string, markdown: string) => openingFindings(file, markdown).map((f) => `${f.line}:${f.rule}`)

describe("page opening", () => {
  it("accepts prose, then a numbered contents list, then the sections", () => {
    const page = `---\ntitle: "T"\n---\n\nWhat this page is for.\n\n${contents(4)}\n${sections(4)}`
    expect(openingFindings("content/docs/a.mdx", page)).toEqual([])
  })

  it("needs no contents with three sections or fewer", () => {
    expect(openingFindings("content/docs/a.md", `Intro.\n\n${sections(3)}`)).toEqual([])
  })

  it("asks for contents on a page with four sections", () => {
    expect(rulesOf("content/docs/a.md", `Intro.\n\n${sections(4)}`)).toEqual(["3:contents"])
  })

  it("rejects an inline contents list on the label line or under it", () => {
    const inline = "**On this page:** [Part 1](#part-1) · [Part 2](#part-2)\n"
    expect(rulesOf("content/docs/a.md", `Intro.\n\n${inline}\n${sections(4)}`)).toEqual(["3:contents"])
    const below = "**On this page:**\n\n[Part 1](#part-1) · [Part 2](#part-2)\n"
    expect(rulesOf("content/docs/a.md", `Intro.\n\n${below}\n${sections(4)}`)).toEqual(["3:contents"])
  })

  it("rejects a bulleted list and an item with two links", () => {
    const bullets = "**On this page:**\n\n- [Part 1](#part-1)\n- [Part 2](#part-2)\n"
    expect(rulesOf("content/docs/a.md", `Intro.\n\n${bullets}\n${sections(4)}`)).toEqual(["3:contents"])
    const two = "**On this page:**\n\n1. [Part 1](#part-1) · [Part 2](#part-2)\n2. [Part 3](#part-3)\n"
    expect(rulesOf("content/docs/a.md", `Intro.\n\n${two}\n${sections(4)}`)).toEqual(["5:contents"])
  })

  it("uses the label of the page's language", () => {
    expect(
      openingFindings("content/docs/a.ru.md", `Вступление.\n\n${contents(4, "На этой странице:")}\n${sections(4)}`),
    ).toEqual([])
    expect(
      openingFindings("content/docs/a.es.md", `Intro.\n\n${contents(4, "En esta página:")}\n${sections(4)}`),
    ).toEqual([])
    expect(rulesOf("content/docs/a.ru.md", `Вступление.\n\n${contents(4)}\n${sections(4)}`)).toEqual(["10:contents"])
  })

  it("rejects a page that opens with its contents, a command or a section", () => {
    expect(rulesOf("content/docs/a.md", `${contents(4)}\n${sections(4)}`)).toEqual(["1:opening"])
    expect(rulesOf("content/docs/a.md", "```sh\ntg sync\n```\n\nText.\n")).toEqual(["1:opening"])
    expect(rulesOf("content/docs/a.md", sections(2))).toEqual(["1:opening"])
  })

  it("skips MDX imports, components and a page title, and ignores headings inside code", () => {
    const page = `import { Steps } from "fumadocs-ui/components/steps"\n\n# Title\n\n<Steps />\n\nIntro.\n\n\`\`\`md\n## a\n## b\n## c\n## d\n\`\`\`\n`
    expect(openingFindings("content/docs/a.mdx", page)).toEqual([])
  })

  it("exempts generated command references, changelogs and roadmaps", () => {
    for (const file of ["content/docs/tg/commands.md", "content/docs/changelog.ru.md", "content/docs/roadmap.es.md"])
      expect(openingFindings(file, sections(5))).toEqual([])
  })
})

describe("wording", () => {
  const found = (file: string, markdown: string) =>
    styleFindings(file, markdown).map((f) => `${f.line}:${f.message.split(":")[0]}`)

  it("flags Russian bureaucratic words and pointers with their line", () => {
    const page =
      "Инструмент является частью WireCat.\nДанный раздел\nпозволяет искать.\n\nШаги ниже, см. ниже, далее рассмотрим.\n"
    expect(found("content/docs/a.ru.md", page)).toEqual([
      "1:«является»",
      "2:«Данный»",
      "3:«позволяет»",
      "5:«Шаги ниже»",
      "5:«см. ниже»",
      "5:«далее рассмотрим»",
    ])
  })

  it("keeps «данные» as data, «следует» as follows, and «ниже» as lower", () => {
    const page = "Данные хранятся локально. Из этого следует, что всё готово. Цена ниже нуля. Вам следует обновить.\n"
    expect(found("content/docs/a.ru.md", page)).toEqual(["1:«следует обновить»"])
  })

  it("lets a step point at the command block right under it", () => {
    expect(styleFindings("content/docs/a.md", "Check it with the commands below.\n")).toEqual([])
    expect(styleFindings("content/docs/a.ru.md", "Проверьте командами ниже. Проверка ниже покажет бота.\n")).toEqual([])
  })

  it("skips the tables generated from the source schema", () => {
    const page = "{/* tables:start — generated by pnpm docs:data-model */}\n\nдля данной цели\n\n{/* tables:end */}\n"
    expect(styleFindings("content/docs/data-model.ru.mdx", page)).toEqual([])
  })

  it("ignores code spans, code blocks and link addresses", () => {
    const page = "Run `в рамках` here.\n\n```sh\necho является\n```\n\n[Поиск](./see-below-in-order-to.md)\n"
    expect(styleFindings("content/docs/a.ru.md", page)).toEqual([])
  })

  it("flags English pointers and filler only on English pages", () => {
    const page = "See below. The steps below work in order to sync. It is important to note this.\n"
    expect(found("content/docs/a.md", page)).toEqual([
      "1:«See below»",
      "1:«steps below»",
      "1:«in order to»",
      "1:«It is important to note»",
    ])
    expect(styleFindings("content/docs/a.es.md", page)).toEqual([])
  })

  it("names the file, line, rule and fix", () => {
    expect(pageFindings("content/docs/a.ru.md", "Это необходимо.\n")).toEqual([
      { file: "content/docs/a.ru.md", line: 1, rule: "style", message: "«необходимо»: write «нужно» or give the step" },
    ])
  })
})

describe("changed pages", () => {
  it("lists new and changed guide pages against the merge base, and null without a base", () => {
    const root = mkdtempSync(join(tmpdir(), "docs-opening-"))
    onTestFinished(() => rmSync(root, { recursive: true, force: true }))
    const git = (...args: string[]) => execFileSync("git", ["-C", root, ...args], { stdio: "pipe" })
    git("init", "-q", "-b", "main")
    git("config", "user.email", "t@example.com")
    git("config", "user.name", "t")
    mkdirSync(join(root, "content/docs"), { recursive: true })
    for (const name of ["old.md", "edited.mdx"]) writeFileSync(join(root, "content/docs", name), "Old.\n")
    git("add", ".")
    git("-c", "commit.gpgsign=false", "commit", "-qm", "base")
    git("checkout", "-qb", "work")
    writeFileSync(join(root, "content/docs/edited.mdx"), "New.\n")
    writeFileSync(join(root, "content/docs/new.ru.md"), "New.\n")
    writeFileSync(join(root, "content/docs/meta.json"), "{}\n")
    expect(changedPages(root, "main")).toEqual(["content/docs/edited.mdx", "content/docs/new.ru.md"])
    expect(changedPages(root, "origin/main")).toBeNull()
  })
})
