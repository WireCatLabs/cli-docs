import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { searchStore } from "@leemour/cli-messaging/services"
import { type MessageStore, openStore } from "@leemour/cli-messaging/store"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import {
  filterClauses,
  initialQuery,
  locator,
  messages,
  replaceFilter,
  searchDemo,
  suggestionsFor,
} from "../lib/search-playground/engine"

const folder = mkdtempSync(join(tmpdir(), "wirecat-search-test-"))
let store: MessageStore
const account = { provider: "telegram", account: "demo" }
beforeAll(async () => {
  store = await openStore({ path: join(folder, "fixture.db") })
  for (const provider of ["telegram", "max"]) {
    const selected = messages.filter((message) => message.provider === provider)
    const key = { provider, account: "demo" }
    for (const chatId of [...new Set(selected.map((message) => message.chatId))]) {
      const rows = selected.filter((message) => message.chatId === chatId)
      await store.saveChats(key, [
        {
          id: chatId,
          title: rows[0].chat,
          kind: rows[0].kind === "private" ? "dialog" : "group",
          unreadCount: 0,
          lastMessageAt: null,
          participantsCount: null,
        },
      ])
      await store.saveMessages(
        key,
        chatId,
        rows.map((message) => ({
          id: message.id,
          chatId,
          text: message.text,
          senderId: message.from,
          senderName: message.from,
          timestamp: message.date,
          editedAt: null,
          outgoing: false,
          attachments: message.has.map(() => ({ kind: "file" as const, name: "estimate.pdf" })),
          replyTo: null,
          forwardedFrom: null,
          reactions: null,
        })),
        { via: "history" },
      )
    }
  }
})
afterAll(async () => {
  await store.close()
  rmSync(folder, { recursive: true })
})
const ids = (rows: { id: string }[]) => rows.map((row) => row.id).sort()
describe("browser demo against the actual indexed SQLite search service", () => {
  it.each([
    initialQuery,
    "Atlas has:file",
    "Atlas from:Alice",
    'chat:"Client studio"',
    "in:max",
    "kind:private",
    "kind:GROUP",
    "has:FILE",
    "in:MAX",
    "invoice OR budget AND Atlas",
    "Atlas NOT budget",
    "invo*",
    "text:/invo.*/",
    "body:/.*Atlas.*/",
    '"final invoice"',
    "date:[2026-10-01 TO 2026-10-31]",
    "date>2026-10-02",
    "invoice nonexisting",
    "NOT invoice",
  ])("returns the same message ids for %s", async (query) => {
    const expected = await searchStore(store, account, {
      text: query,
      language: "lucene",
      timezone: "UTC",
      source: "all",
      newest: true,
      context: 2,
      limit: 100,
    })
    expect(ids(searchDemo(query).map((hit) => hit.message))).toEqual(ids(expected.items))
  })
  it("keeps surrounding context inside the original account and chat", async () => {
    const expected = await searchStore(store, account, {
      text: initialQuery,
      language: "lucene",
      timezone: "UTC",
      source: "all",
      newest: true,
      context: 2,
      limit: 100,
    })
    for (const hit of searchDemo(initialQuery)) {
      const matching = expected.items.find((row) => row.id === hit.message.id)
      expect(matching?.locator).toBe(locator(hit.message))
      expect(ids(hit.context)).toEqual(ids(matching?.context ?? []))
    }
  })
  it("rejects malformed, unsupported and unfinished input without broadening it", () => {
    for (const query of ["chat:", "invoice~1", "(invoice OR", "filename:*.pdf", "text:/~invoice/", "body:/a{20000}/"])
      expect(() => searchDemo(query), query).toThrow()
    expect(searchDemo("nothing")).toEqual([])
    expect(searchDemo("")).toHaveLength(messages.length)
  })
})
describe("cursor-sensitive completion", () => {
  it("inserts a field inside a query and preserves the suffix", () => {
    const query = "invoice ch AND budget"
    expect(suggestionsFor(query, 10).find((row) => row.label === "chat:")?.value).toBe("invoice chat: AND budget")
  })
  it("quotes chat names and preserves text after a quoted value", () => {
    const query = 'chat:"Clien old" AND invoice'
    expect(suggestionsFor(query, 11).find((row) => row.label === "Client studio")?.value).toBe(
      'chat:"Client studio" AND invoice',
    )
  })
  it("uses the supported field registry and does not suggest planned or demo-unsupported fields", () => {
    const labels = suggestionsFor("", 0).map((row) => row.label)
    expect(labels).toContain("chat:")
    expect(labels).not.toContain("filename:")
    expect(labels).not.toContain("preset:")
  })
})

describe("reversible query filters and value suggestions", () => {
  it("replaces a date instead of duplicating it, and removes its adjacent AND", () => {
    const query = "Atlas AND date:[2026-10-01 TO 2026-10-31]"
    expect(replaceFilter(query, "date", "2026-10-03")).toBe("Atlas AND date:2026-10-03")
    expect(replaceFilter(query, "date")).toBe("Atlas")
    expect(replaceFilter("date:2026-10-03 AND invoice", "date")).toBe("invoice")
  })
  it("ignores field-looking text inside quoted strings and regex", () => {
    expect(filterClauses('"chat:foo" body:/.*from:Alice.*/ has:file').map((clause) => clause.field)).toEqual([
      "body",
      "has",
    ])
    expect(replaceFilter('"has:file" AND has:file', "has")).toBe('"has:file"')
    expect(replaceFilter('"invoice ()" AND has:file', "has")).toBe('"invoice ()"')
  })
  it("offers useful words and complete date ranges while editing a range", () => {
    expect(suggestionsFor("text:", 5).map((item) => item.label)).toContain("invoice")
    const query = "Atlas date:[2026-10-01 TO *] AND has:file"
    const options = suggestionsFor(query, 19)
    expect(suggestionsFor("date>2026-10-01", 15).find((item) => item.labelKey === "sampleDay")?.value).toBe(
      "date:2026-10-03",
    )
    expect(options.length).toBeGreaterThan(3)
    expect(options.find((item) => item.labelKey === "sampleDay")?.value).toBe("Atlas date:2026-10-03 AND has:file")
  })
  it("an empty query really includes every sample chat and message", async () => {
    const expected = await searchStore(store, account, {
      text: "in:all",
      language: "lucene",
      source: "all",
      newest: true,
      context: 2,
      limit: 100,
    })
    expect(ids(searchDemo("").map((hit) => hit.message))).toEqual(ids(expected.items))
  })
})
