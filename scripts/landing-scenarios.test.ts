import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { describe, expect, it } from "vitest"
import { maxSession } from "./scenario-platforms.mjs"

type Step = {
  ask?: string
  tool?: string
  out?: string
  say?: string
  sources?: { text: string; chat: string; date: string }[]
}
type Session = { id: string; steps: Step[] }
const context = { window: {} as { WireScenarioVariants?: Record<string, Session[]> } }
runInNewContext(readFileSync("design/landing/scenario-variants.js", "utf8"), context)
const scenarios = context.window.WireScenarioVariants ?? {}

const sessionById = (sessions: Session[], id: string) => {
  const found = sessions.find((session) => session.id === id)
  if (!found) throw new Error(`Missing landing scenario: ${id}`)
  return found
}

describe("reviewed landing workflows", () => {
  it("starts with context, cross-messenger search and approval-based group management", () => {
    for (const sessions of Object.values(scenarios)) {
      expect(sessions.slice(0, 3).map((session) => session.id)).toEqual(["context", "search", "moderation"])
      const search = sessionById(sessions, "search").steps
      expect(search.some((step) => step.tool?.includes("search messages") && step.tool.includes("--source all"))).toBe(
        true,
      )
      const group = sessionById(sessions, "moderation").steps
      const preview = group.findIndex(
        (step) => step.tool?.includes("chats moderate") && step.tool.includes("--dry-run"),
      )
      const action = group.findIndex((step) => step.tool?.startsWith("tg messages delete"))
      expect(action).toBeGreaterThan(preview)
      expect(group[action - 1].ask).toBeTruthy()
      expect(group[action].tool).toContain("301 48210 48211 --for-everyone")
    }
  })
  it("uses real MAX option differences and retains messenger-specific source locators", () => {
    for (const sessions of Object.values(scenarios)) {
      const group = maxSession(sessionById(sessions, "moderation"))
      expect(group.steps.some((step: Step) => step.tool?.startsWith("max chats moderate 301 --dry-run"))).toBe(true)
      expect(group.steps.some((step: Step) => step.tool?.includes("chats check"))).toBe(false)
      const preview = group.steps.find((step: Step) => step.tool?.startsWith("max chats moderate"))
      expect(JSON.parse(preview.out)).toMatchObject({ chatId: "301", rows: expect.any(Array) })
      const files = maxSession(sessionById(sessions, "files"))
      expect(files.steps.filter((step: Step) => step.tool?.includes("--output ./Atlas"))).toHaveLength(3)
      expect(files.steps.some((step: Step) => step.tool?.includes("--output-dir"))).toBe(false)
      const search = maxSession(sessionById(sessions, "search"))
      expect(
        search.steps
          .filter((step: Step) => step.tool?.startsWith("max search messages"))
          .every((step: Step) => step.tool?.includes("--language legacy")),
      ).toBe(true)
      expect(search.steps.some((step: Step) => step.tool?.startsWith("tg messages context msg:telegram/"))).toBe(true)
      expect(search.steps.some((step: Step) => step.tool?.startsWith("max messages context msg:max/"))).toBe(true)
      const bot = maxSession(sessionById(sessions, "bot"))
      expect(
        bot.steps.some((step: Step) => step.tool?.includes("bot messages list") && step.tool.includes("--offline")),
      ).toBe(true)
    }
  })
  it("quotes only evidence actually present in an earlier demonstrated tool result", () => {
    const textValues = (value: unknown): string[] => {
      if (!value || typeof value !== "object") return []
      if (Array.isArray(value)) return value.flatMap(textValues)
      const object = value as Record<string, unknown>
      return [typeof object.text === "string" ? object.text : "", ...Object.values(object).flatMap(textValues)]
    }
    for (const sessions of Object.values(scenarios))
      for (const session of sessions) {
        const quotes: string[] = []
        for (const step of session.steps) {
          if (step.tool) quotes.push(...textValues(JSON.parse(step.out ?? "{}")))
          for (const source of step.sources ?? []) {
            expect(quotes).toContain(source.text)
            expect(source.chat).toBeTruthy()
            expect(Number.isNaN(Date.parse(source.date))).toBe(false)
          }
        }
      }
  })
  it("gives each scenario an explicit natural CLI request and unambiguous step type", () => {
    for (const [lang, prefix] of Object.entries({ ru: "Используй tg cli,", en: "Use tg cli,", es: "Usa tg cli," })) {
      const ids = scenarios[lang].map((session) => session.id)
      expect(new Set(ids).size).toBe(ids.length)
      expect([...ids].sort()).toEqual(scenarios.en.map((session) => session.id).sort())
      for (const session of scenarios[lang]) {
        expect(session.steps[0].ask?.startsWith(prefix)).toBe(true)
        for (const step of session.steps) {
          expect([step.ask, step.tool, step.say].filter(Boolean)).toHaveLength(1)
          if (step.tool) expect(() => JSON.parse(step.out ?? "")).not.toThrow()
        }
      }
    }
  })
  it("finds and reads Tom's chat before searching the local store", () => {
    for (const sessions of Object.values(scenarios)) {
      for (const id of ["context", "commitments"]) {
        const commands = sessionById(sessions, id).steps.flatMap((step) => (step.tool ? [step.tool] : []))
        const read = commands.indexOf("tg messages list 503 --limit 30")
        const search = commands.findIndex(
          (command) => command.startsWith("tg search messages") && command.includes("--chat 503"),
        )
        expect(read).toBeGreaterThan(0)
        expect(commands[read - 1]).toMatch(/^tg chats list --search/)
        expect(search).toBeGreaterThan(read)
      }
      const steps = sessionById(sessions, "commitments").steps
      const send = steps.findIndex((step) => step.tool?.startsWith("tg messages send 503"))
      expect(steps[send - 1].ask).toBeTruthy()
      const drafts = steps.find((step) => (step.say?.match(/<blockquote>/g)?.length ?? 0) === 3)?.say ?? ""
      const approvedText = [...drafts.matchAll(/<blockquote><p>(.*?)<\/p><\/blockquote>/g)][2]?.[1]
      expect(steps[send].tool).toBe(`tg messages send 503 "${approvedText}"`)
    }
  })
  it("completes file collection and uses bot-observed context before approved bot sending", () => {
    for (const sessions of Object.values(scenarios)) {
      expect(
        sessionById(sessions, "files").steps.filter((step) => step.tool?.startsWith("tg messages download")),
      ).toHaveLength(3)
      const bot = sessionById(sessions, "bot").steps
      const read = bot.findIndex((step) => step.tool?.startsWith("tg sales bot messages list"))
      const send = bot.findIndex((step) => step.tool?.startsWith("tg sales bot messages send"))
      expect(read).toBeGreaterThan(0)
      expect(send).toBeGreaterThan(read)
      expect(bot[send - 1].ask).toBeTruthy()
      expect(bot.some((step) => step.tool?.startsWith("tg search messages"))).toBe(false)
    }
  })
})
