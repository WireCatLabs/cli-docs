import { fromMarkdown } from "mdast-util-from-markdown"
import { describe, expect, it } from "vitest"
import { remarkAnchorAliases } from "../lib/remark-anchor-aliases"
import { commandReferences, remarkDocUsability, resolveCommand } from "../lib/remark-doc-usability"
import { preferredSearchTool, searchIntentPhrases } from "../lib/search-intents"

describe("documentation command references", () => {
  it("marks native reference prose as English without including the next localized section or altering examples", () => {
    const tree = fromMarkdown(
      '### `tg bot api`\n\nLocalized notice.\n\n<div lang="en">\n\n#### `tg bot api get-me`\n\nNative description.\n\n```sh\ntg bot api get-me\n```\n\n</div>\n\n## Localized next section\n',
    )
    remarkDocUsability()(tree, { path: "/project/content/docs/tg/commands.ru.md" })
    expect(tree.children[2]).toMatchObject({
      data: { hName: "div", hProperties: { lang: "en" } },
      children: [{ type: "heading", depth: 4 }, { type: "paragraph" }, { type: "code", value: "tg bot api get-me" }],
    })
    expect(tree.children[3]).toMatchObject({ type: "heading", depth: 2 })
    expect(JSON.stringify(tree.children[2])).not.toContain("Localized next section")
  })

  it("labels explicit prompts without treating output examples as requests or changing their copyable text", () => {
    const tree = fromMarkdown(
      "```text prompt\nUse tg cli.\nKeep line breaks.\n```\n\n```text\nLogged in as a user.\n```",
    )
    remarkDocUsability()(tree, { path: "/project/content/docs/first-tasks.ru.md" })
    expect(tree.children[0]).toMatchObject({
      data: { hName: "agent-prompt", hProperties: { text: "Use tg cli.\nKeep line breaks.", language: "ru" } },
    })
    expect(tree.children[1]).toMatchObject({ type: "code", value: "Logged in as a user." })
  })
  it("keeps browser-login screenshots in an accessible closed disclosure", () => {
    const tree = fromMarkdown(
      "> **See the my.telegram.org login screen**\n>\n> ![Empty login form](/telegram-app-login.png)\n>\n> Website login comes before account authorization.\n",
    )
    remarkDocUsability()(tree, { path: "/project/content/docs/tg/sessions.md" })
    expect(tree.children[0]).toMatchObject({
      data: { hName: "details", hProperties: { id: "telegram-app-login" } },
      children: [
        { data: { hName: "summary" } },
        { type: "paragraph", children: [{ type: "image", url: "/telegram-app-login.png" }] },
        { type: "paragraph" },
      ],
    })
  })
  const index = commandReferences(
    "## General options\n\n## `tg doctor`\n\n### `tg doctor report`\n\n#### `tg doctor report create`\n",
  )
  const indexes = new Map([["tg", index]])
  it("targets the most specific existing command, leaving flags and arguments unchanged", () => {
    expect(resolveCommand("tg doctor report create --output report.json", undefined, indexes)).toEqual({
      tool: "tg",
      command: "tg doctor report create",
      anchor: "tg-doctor-report-create",
    })
    expect(resolveCommand("doctor --online", "tg", indexes)?.anchor).toBe("tg-doctor")
    expect(resolveCommand("TG_API_ID", "tg", indexes)).toBeUndefined()
    expect(resolveCommand("tg unknown", "tg", indexes)).toBeUndefined()
    expect(resolveCommand("doctor", undefined, indexes)).toBeUndefined()
  })
  it("adds localized references to prose but never inside existing links, headings or executable blocks", () => {
    const tree = fromMarkdown(
      "## `tg doctor`\n\nUse `tg doctor --online` and [`tg doctor`](./diagnostics.md).\n\n```sh\ntg doctor\n```\n",
    )
    remarkDocUsability(indexes)(tree, { path: "/project/content/docs/tg/installation.ru.md" })
    const result = JSON.stringify(tree)
    expect(result.match(/command-reference/g)).toHaveLength(1)
    expect(result).toContain("/ru/docs/tg/commands#tg-doctor")
    expect(tree.children[2].type).toBe("code")
  })
  it("keeps a source section closed, with its original anchor and every executable example", () => {
    const tree = fromMarkdown("## Install\n\n## From source\n\n```sh\npnpm build\n```\n\n## Files\n")
    remarkDocUsability()(tree, { path: "/project/content/docs/tg/installation.md" })
    expect(tree.children[1]).toMatchObject({
      data: { hName: "details" },
      children: [
        {
          data: { hName: "summary" },
          children: [{ type: "heading", data: { hProperties: { "data-static-heading": true } } }],
        },
        { type: "code", value: "pnpm build" },
      ],
    })
    expect(tree.children[2]).toMatchObject({ type: "heading" })
  })
  it("removes completion instructions while retaining the next section's translated deep link", () => {
    const tree = fromMarkdown(
      '## Shell completion\n\n```sh\nmax complete zsh\n```\n\n<a id="обновление-и-удаление" />\n\n## Upgrade\n\nKeep this.\n',
    )
    remarkAnchorAliases()(tree)
    remarkDocUsability()(tree, { path: "/project/content/docs/max/installation.md" })
    expect(JSON.stringify(tree)).not.toContain("max complete zsh")
    expect(tree.children[0]).toMatchObject({ data: { hProperties: { id: "обновление-и-удаление" } } })
    expect(tree.children[1]).toMatchObject({ type: "heading" })
  })
  it("keeps the next section's alias outside the collapsed source section", () => {
    const tree = fromMarkdown('## From source\n\n```sh\npnpm build\n```\n\n<a id="where-files-go" />\n\n## Files\n')
    remarkAnchorAliases()(tree)
    remarkDocUsability()(tree, { path: "/project/content/docs/tg/installation.md" })
    expect(tree.children[1]).toMatchObject({ data: { hProperties: { id: "where-files-go" } } })
  })
})

describe("search by task and error", () => {
  it("keeps messenger-specific error phrases on the correct tool's pages", () => {
    const tg = searchIntentPhrases(["tg", "troubleshooting"], "ru").join(" ")
    expect(tg).toContain("Команда tg не найдена")
    expect(tg).not.toContain("Команда max")
    expect(searchIntentPhrases(["tg", "sessions"], "es").join(" ")).toContain("api_id")
    expect(searchIntentPhrases(["max", "sessions"], "es").join(" ")).not.toContain("api_id")
  })
  it("uses the current messenger unless the search explicitly names another", () => {
    expect(preferredSearchTool("как отсканировать QR", "/ru/docs/tg/sessions")).toBe("tg")
    expect(preferredSearchTool("max command not found", "/en/docs/tg")).toBe("max")
    expect(preferredSearchTool("telegram login", "/en/docs/max")).toBe("tg")
    expect(preferredSearchTool("tg and max", "/en/docs/max")).toBeUndefined()
    expect(preferredSearchTool("command not found", "/en/docs/installation")).toBeUndefined()
  })
})
