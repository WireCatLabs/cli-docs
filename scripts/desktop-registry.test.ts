import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { buildRegistry, type Desktop, desktopProblems, plainWord, registryProblems } from "./desktop-registry"
import { type Tool, toolProblems } from "./sync"

const ours = JSON.parse(readFileSync("tools.json", "utf8")) as Tool[]

const desktop = (): Desktop => ({
  tagline: "Acme notes in your archive",
  bin: "acme",
  profiles: { args: ["profile", "list", "--json", "--no-record"], shape: "items" },
  doctor: ["{profile}", "doctor", "--json", "--record"],
  runs: null,
  search: null,
  setup: ["{profile}", "setup"],
  signIn: { gives: "your notes", asks: "an API token", guide: "https://example.com/acme/token" },
  skill: null,
  mcpServer: null,
  tasks: null,
  sync: null,
  storeInfo: null,
  storeTables: null,
  storeTableSizes: null,
  storeCheck: null,
  storeBackup: null,
  storeBackupEncrypted: null,
  storage: { app: "acme-cli", env: "ACME" },
  settings: null,
})

const acme = (change: Partial<Desktop> = {}, entry: Partial<Tool> = {}): Tool =>
  ({
    name: "acme",
    displayName: "Acme Notes",
    repo: "example/acme-cli",
    package: "@example/acme-cli",
    lang: "en",
    summary: { en: "Acme notes, searchable offline." },
    docsRef: "v1.0.0",
    community: true,
    desktop: { ...desktop(), ...change },
    ...entry,
  }) as Tool

describe("desktop entries", () => {
  it("accepts a community entry with every catalog key", () => {
    expect(toolProblems(acme())).toEqual([])
    expect(registryProblems([...ours, acme()])).toEqual([])
  })

  it("refuses shell syntax in any command word, however deep", () => {
    for (const word of ["setup;rm", "a b", "$(id)", "`id`", "a|b", "a&b", "~/x", "*", "x\ny", "'x'", "-", "---x"])
      expect(desktopProblems(acme({ setup: [word] })).join(), word).toContain("not allowed")
    const deep = { run: ["sync"], last: ["runs", ">", "/tmp/x"], lastShape: "runs", what: "notes", note: null }
    expect(desktopProblems(acme({ sync: deep })).join()).toContain("not allowed")
    for (const word of ["--no-record", "--", "{profile}", "email:{profile}", "--limit={limit}", "a@b/c"])
      expect(plainWord(word), word).toBe(true)
  })

  it("refuses the fields only WireCat's tools set, and those the entry already holds", () => {
    expect(desktopProblems(acme({ storeReset: ["store", "reset"] })).join()).toContain("storeReset")
    expect(desktopProblems(acme({ bot: null })).join()).toContain("bot")
    expect(desktopProblems(acme({ package: "@example/other" })).join()).toContain("comes from the entry")
    expect(desktopProblems(acme({ signIn: { gives: "x", asks: "y", command: "curl x | sh" } })).join()).toContain(
      "signIn.command",
    )
    expect(desktopProblems(acme({ surprise: 1 })).join()).toContain('no "surprise"')
    expect(desktopProblems(acme({ settings: undefined })).join()).toContain('"settings" is missing')
  })

  it("refuses links that are not https, bad names and a desktop object on one of ours", () => {
    expect(desktopProblems(acme({ signIn: { gives: "x", asks: "y", guide: "http://x" } })).join()).toContain("https")
    expect(desktopProblems(acme({}, { name: "acme2" })).join()).toContain("lowercase letters")
    expect(desktopProblems(acme({}, { package: "acme-cli" })).join()).toContain("scoped")
    expect(desktopProblems(acme({ storage: { app: "Acme", env: "acme" } })).join()).toContain("storage")
    expect(desktopProblems(acme({}, { community: undefined })).join()).toContain("only a community entry")
  })

  it("refuses a name, program, package or data folder of ours or of an earlier entry", () => {
    const taken = (t: Tool) => registryProblems([...ours, t]).join()
    expect(taken(acme({}, { name: "tg" }))).toContain("name is taken")
    expect(taken(acme({}, { name: "email" }))).toContain("name is taken")
    expect(taken(acme({ bin: "memo" }))).toContain("program memo")
    expect(taken(acme({ storage: { app: "tg-cli", env: "ACME" } }))).toContain("data folder")
    expect(taken(acme({ storage: { app: "acme-cli", env: "WIRECAT" } }))).toContain("data folder")
    const twin = acme({ bin: "acme2", storage: { app: "acme2", env: "ACMETWO" } }, { package: "@example/acme2" })
    expect(registryProblems([...ours, acme(), twin]).join()).toContain("name is taken")
  })
})

describe("the signed list", () => {
  const now = new Date("2026-11-05T12:00:00Z")

  it("holds only community entries with a desktop object, as full catalog entries", () => {
    const list = buildRegistry([...ours, acme(), { ...acme(), name: "beta", desktop: undefined } as Tool], now)
    expect(list).toMatchObject({ format: 1, version: 1793880000, generated_at: "2026-11-05T12:00:00.000Z" })
    expect(list.expires_at).toBe("2026-12-05T12:00:00.000Z")
    expect(list.tools).toHaveLength(1)
    expect(list.tools[0]).toMatchObject({
      id: "acme",
      community: true,
      name: "Acme Notes",
      repo: "https://github.com/example/acme-cli",
      summary: "Acme notes, searchable offline.",
      docs: "https://wirecat.dev/docs/acme",
      bin: "acme",
      storeReset: null,
      storeResetPreview: null,
    })
  })

  it("is not built while an entry has a problem", () => {
    expect(() => buildRegistry([...ours, acme({ setup: ["a;b"] })], now)).toThrow("not allowed")
  })

  it("builds from today's tools.json", () => {
    expect(buildRegistry(ours, now).tools.length).toBeGreaterThanOrEqual(0)
  })
})
