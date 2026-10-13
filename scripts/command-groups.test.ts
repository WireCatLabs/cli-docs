import { readFileSync } from "node:fs"
import { expect, it } from "vitest"
import { commandGroupForAnchor, commandGroups, splitCommandReference } from "../lib/command-groups"
import { commandReferences } from "../lib/remark-doc-usability"
import { documentationDescription, seoLocales } from "../lib/seo"

// These checks require released sources captured by sync, before the full deployment suite.
it("covers every released Drive sidebar page with distinct localized metadata", () => {
  const sidebar = JSON.parse(readFileSync("content/upstream/drive/meta.json", "utf8")) as { pages: string[] }
  const pages = sidebar.pages.filter((page) => !page.startsWith("---"))
  for (const lang of seoLocales) {
    const descriptions = new Set<string>()
    for (const slug of pages) {
      const description = documentationDescription(lang, slug === "index" ? ["drive"] : ["drive", slug])
      expect(description).toContain("Google Drive")
      descriptions.add(description)
    }
    expect(descriptions.size).toBe(pages.length)
  }
})

it("partitions every generated command exactly once while retaining shared options and exit codes", () => {
  for (const tool of ["tg", "max"]) {
    const source = readFileSync(`content/docs/${tool}/commands.md`, "utf8")
    const parts = splitCommandReference(source, "en")
    const commands = commandGroups.flatMap((group) => [...commandReferences(parts[group]).keys()])
    const original = [...commandReferences(source).keys()]
    expect(commands.sort()).toEqual(original.sort())
    expect(new Set(commands).size).toBe(commands.length)
    expect(parts.bot).toContain(`${tool} bot`)
    expect(parts.admin).toContain(`${tool} chats members`)
    for (const group of commandGroups) expect(parts[group]).toContain("validation_error")
  }
})
it("routes existing bot/admin/personal anchors, including multiword commands and malformed hashes", () => {
  expect(commandGroupForAnchor("#tg-bot-api-send-message")).toBe("bot")
  expect(commandGroupForAnchor("#max-chats-members-add")).toBe("admin")
  expect(commandGroupForAnchor("#tg-chats-requests-accept")).toBe("admin")
  expect(commandGroupForAnchor("#tg-stats-messages-show")).toBe("admin")
  expect(commandGroupForAnchor("#tg-topics-create")).toBe("admin")
  expect(commandGroupForAnchor("#tg-topics-list")).toBe("personal")
  expect(commandGroupForAnchor("#tg-store-export")).toBe("setup")
  expect(commandGroupForAnchor("#max-session-start")).toBe("setup")
  expect(commandGroupForAnchor("#tg-messages-search")).toBe("personal")
  expect(commandGroupForAnchor("#%invalid")).toBe("personal")
})
