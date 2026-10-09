import { readFileSync } from "node:fs"
import { expect, it } from "vitest"
import { commandGroupForAnchor, commandGroups, splitCommandReference } from "../lib/command-groups"
import { commandReferences } from "../lib/remark-doc-usability"

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
  expect(commandGroupForAnchor("#tg-messages-search")).toBe("personal")
  expect(commandGroupForAnchor("#%invalid")).toBe("personal")
})
