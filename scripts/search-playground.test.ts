import { mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { searchStore } from "@leemour/cli-messaging/services"
import { type MessageStore, openStore } from "@leemour/cli-messaging/store"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createDemoDates, demoDates } from "../lib/search-playground/dates"
import {
  createDemoMessages,
  demoFields,
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
          attachments: message.has
            .filter((kind) => kind !== "link")
            .map((kind) => ({ kind, name: "sample-attachment" })),
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
    "has:FILE",
    ...[
      "attachment",
      "link",
      "photo",
      "image",
      "video",
      "audio",
      "voice",
      "sticker",
      "contact",
      "location",
      "poll",
    ].flatMap((kind) => [`has:${kind}`, `Atlas has:${kind}`, `has:${kind} date:${demoDates.day(-1)}`]),
    "in:MAX",
    "invoice OR budget AND Atlas",
    "Atlas NOT budget",
    "invo*",
    "text:/invo.*/",
    '"final invoice"',
    `date:[${demoDates.start} TO ${demoDates.end}]`,
    `date>${demoDates.day(-3)}`,
    `date:${demoDates.day(-2)}`,
    `date:${demoDates.day(-1)}`,
    `date:${demoDates.today}`,
    "text:coffee",
    "from:Mia AND text:budget",
    "from:Sam",
    "from:Leo",
    "from:Noah",
    "invoice nonexisting",
    "NOT invoice",
    "in:max AND has:voice AND from:Mia",
    `in:telegram AND has:file AND date:${demoDates.today}`,
    `Atlas AND (has:file OR has:link) AND date:[${demoDates.today} TO ${demoDates.end}]`,
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
    for (const query of [
      "chat:",
      "invoice~1",
      "(invoice OR",
      "filename:*.pdf",
      "text:/~invoice/",
      "text:/a{20000}/",
      "body:Atlas",
      "kind:private",
    ])
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
    expect(labels).not.toContain("kind:")
    expect(labels).not.toContain("body:")
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
    expect(filterClauses('"chat:foo" text:/.*from:Alice.*/ has:file').map((clause) => clause.field)).toEqual([
      "text",
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
      `date:${demoDates.today}`,
    )
    expect(options.length).toBeGreaterThan(3)
    expect(options.find((item) => item.labelKey === "sampleDay")?.value).toBe(
      `Atlas date:${demoDates.today} AND has:file`,
    )
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

describe("discoverable sample search paths", () => {
  it("has an Atlas example and another topic for every attachment filter", () => {
    const kinds = demoFields.find((field) => field.name === "has")?.values ?? []
    expect(kinds.length).toBe(12)
    for (const kind of kinds) {
      expect(searchDemo(`Atlas has:${kind}`).length, kind).toBeGreaterThan(0)
      expect(searchDemo(`has:${kind} NOT Atlas`).length, kind).toBeGreaterThan(0)
    }
    expect(searchDemo("has:link NOT has:attachment")).toHaveLength(4)
  })
  it("keeps concrete values out of general field completion", () => {
    const general = suggestionsFor("", 0).map((item) => item.label)
    expect(general).toContain("text:")
    expect(general).not.toContain("invoice")
    expect(general).not.toContain("Alice")
    expect(suggestionsFor("from:", 5).map((item) => item.label)).toContain("Alice")
    expect(suggestionsFor("text:", 5).map((item) => item.label)).toContain("coffee")
  })
  it("offers distinct invoice, budget, coffee and date paths", () => {
    expect(searchDemo("text:invoice")).toHaveLength(20)
    expect(searchDemo("text:budget")).toHaveLength(18)
    expect(searchDemo("text:coffee")).toHaveLength(6)
    expect(searchDemo(`date:${demoDates.day(-2)}`)).toHaveLength(8)
    expect(searchDemo(`date:${demoDates.day(-1)}`)).toHaveLength(26)
    expect(searchDemo(`date:${demoDates.today}`)).toHaveLength(10)
  })
})

describe("rolling sample dates", () => {
  it.each(["2027-01-01T00:05:00Z", "2028-03-01T23:55:00Z", "2026-12-31T12:00:00Z"])(
    "keeps 50 messages within two calendar days of %s",
    (instant) => {
      const dates = createDemoDates(new Date(instant))
      const rows = createDemoMessages(dates)
      expect(rows).toHaveLength(50)
      expect(new Set(rows.map((row) => row.id)).size).toBe(50)
      expect(new Set(rows.map((row) => row.chatId)).size).toBe(6)
      for (const row of rows) {
        expect(row.date.slice(0, 10) >= dates.start && row.date.slice(0, 10) <= dates.end).toBe(true)
        expect(Number.isFinite(Date.parse(row.date))).toBe(true)
      }
      expect(rows.find((row) => row.id === "12")?.text).toContain(dates.deadline)
    },
  )
  it("handles year and leap-day boundaries in UTC", () => {
    expect(createDemoDates(new Date("2027-01-01T00:05:00Z")).start).toBe("2026-12-30")
    const leap = createDemoDates(new Date("2028-03-01T00:00:00Z"))
    expect(leap.day(-1)).toBe("2028-02-29")
    expect(leap.monthEnd).toBe("2028-03-31")
  })
})

describe("field values and Space completion", () => {
  it("offers and inserts every has and in value", () => {
    for (const field of ["has", "in"]) {
      const options = suggestionsFor(`${field}:`, field.length + 1)
      expect(options.length).toBeGreaterThan(3)
      for (const option of options) expect(searchDemo(option.value).length, option.value).toBeGreaterThan(0)
    }
    expect(suggestionsFor("in:ma", 5).map((item) => item.value)).toEqual(["in:max"])
  })
  it.each(["invoice ", "has:file ", "in:max ", 'chat:"Client studio" ', "Atlas AND (invoice OR budget) "])(
    "offers operators and fields after %s",
    (query) => {
      const options = suggestionsFor(query, query.length)
      expect(options.map((item) => item.label)).toEqual(expect.arrayContaining(["AND", "OR", "NOT", "has:", "in:"]))
      expect(options.find((item) => item.label === "has:")?.value).toBe(`${query}has:`)
    },
  )
})
