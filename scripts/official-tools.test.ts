import { readFileSync } from "node:fs"
import { gzipSync } from "node:zlib"
import { describe, expect, it } from "vitest"
import { buildRegistry } from "./desktop-registry"
import {
  type Allowed,
  allowProblems,
  differences,
  driftProblems,
  type Manifest,
  type Manifests,
  manifestPortProblems,
  missingCommands,
  type Overlays,
  officialEntries,
  overlayProblems,
  portProblems,
  staleProblems,
  tarEntry,
} from "./official-tools"
import type { Tool } from "./sync"

const tools = JSON.parse(readFileSync("tools.json", "utf8")) as Tool[]
const overlays = JSON.parse(readFileSync("registry/official.json", "utf8")) as Overlays
const manifests = JSON.parse(readFileSync("registry/official-manifests.json", "utf8")) as Manifests

const beeline: Tool = {
  name: "beeline",
  displayName: "Beeline",
  repo: "WireCatLabs/beeline-cli",
  package: "@wirecat/beeline-cli",
  lang: "ru",
  summary: { en: "Beeline calls for your agent.", ru: "Звонки Билайна для агента.", es: "Llamadas de Beeline." },
}

const manifest = (desktop: Record<string, unknown> = {}): Manifest => ({
  version: "0.5.0",
  manifestSha256: "a".repeat(64),
  bin: "wcat-beeline",
  bins: ["beeline", "wcat-beeline"],
  desktop: {
    tagline: "Beeline calls, searchable",
    doctor: ["{profile}", "doctor", "--record", "--json"],
    search: null,
    storage: { app: "beeline-cli", env: "WCBEELINE" },
    mcpServer: { start: ["mcp", "server", "start"] },
    ...desktop,
  },
})

function tgz(files: Record<string, string>): Buffer {
  const blocks: Buffer[] = []
  for (const [name, text] of Object.entries(files)) {
    const header = Buffer.alloc(512)
    header.write(name, 0)
    header.write(`${Buffer.byteLength(text).toString(8).padStart(11, "0")}\0`, 124)
    header.write("0", 156)
    const body = Buffer.alloc(Math.ceil(Buffer.byteLength(text) / 512) * 512)
    body.write(text)
    blocks.push(header, body)
  }
  return gzipSync(Buffer.concat([...blocks, Buffer.alloc(1024)]))
}

describe("official tools in the signed list", () => {
  it("lists each of our tools that ships a manifest, with what official.json adds", () => {
    const list = officialEntries(
      [...tools, beeline],
      { ...overlays, beeline: { mcpPort: 8740, icon: "M2 2h20v20H2z", i18n: { ru: { tagline: "Звонки" } } } },
      { ...manifests, beeline: manifest() },
    )
    const entry = list.find((e) => e.id === "beeline")
    expect(entry).toMatchObject({
      name: "Beeline",
      package: "@wirecat/beeline-cli",
      repo: "https://github.com/WireCatLabs/beeline-cli",
      docs: "https://wirecat.dev/en/docs/beeline",
      summary: "Beeline calls for your agent.",
      summaries: { ru: "Звонки Билайна для агента." },
      bin: "wcat-beeline",
      mcpPort: 8740,
      icon: "M2 2h20v20H2z",
      i18n: { ru: { tagline: "Звонки" } },
    })
    expect(entry?.desktop.search).toBeNull()
    expect(list.find((e) => e.id === "bitrix")?.package).toBe("@wirecat/bitrix24-cli")
    expect(officialEntries([beeline], {}, { beeline: null })).toEqual([])
  })

  it("puts them beside the community tools, in a key older apps do not read", () => {
    const list = buildRegistry(tools, new Date("2026-11-23T12:00:00Z"), overlays, manifests)
    expect(list.format).toBe(1)
    expect(list.official.length).toBe(Object.values(manifests).filter(Boolean).length)
    expect(list.official.every((e) => e.package.startsWith("@wirecat/") && !("community" in e))).toBe(true)
  })

  it("refuses an overlay that could load something, take a bot's screens or a port twice", () => {
    const check = (o: Overlays) => overlayProblems([...tools, beeline], o).join()
    expect(check({ beeline: { icon: '<path d="M0 0"/>' } })).toContain("one SVG path")
    expect(check({ beeline: { icon: "M0 0 url(x)" } })).toContain("one SVG path")
    expect(check({ beeline: { screen: "tg" } })).toContain("need a bot")
    expect(check({ beeline: { mcpPort: 9000 } })).toContain("8700 to 8769")
    expect(check({ beeline: { mcpPort: 8740 }, b24: { id: "bitrix", mcpPort: 8740 } })).toContain("beeline's")
    expect(check({ beeline: { i18n: { de: { tagline: "x" } } } as Overlays["x"] })).toContain("en, ru and es")
    expect(check({ beeline: { i18n: { ru: { tagline: "x".repeat(56) } } } })).toContain("55 at most")
    expect(check({ nobody: {} })).toContain("no tool of ours")
    expect(check({ b24: { id: "email" }, mail: { id: "email" } })).toContain("Desktop id email")
    expect(overlayProblems(tools, overlays)).toEqual([])
  })
})

describe("the drift check", () => {
  const catalog = {
    tools: [
      {
        id: "beeline",
        bin: "beeline",
        tagline: "Beeline calls, searchable",
        doctor: ["{profile}", "doctor", "--record", "--json"],
        storage: { app: "beeline-cli", env: "WCBEELINE" },
        mcpServer: { port: 8740, start: ["mcp", "server", "start"] },
        search: { args: ["search"] },
      },
    ],
  }
  const drift = (m: Manifest, allowed: Allowed[] = [], cat = catalog) =>
    driftProblems([beeline], {}, { beeline: m }, cat, allowed)

  it("compares the keys a manifest can state, and Desktop's own keys not at all", () => {
    expect(drift(manifest())).toEqual([])
    expect(
      differences({ remove: { minVersion: "0.0.0" } }, { remove: { minVersion: "0.9.0" } }, "accountRemove"),
    ).toEqual([])
    expect(differences({ setupFrom: "0.0.0" }, { setupFrom: "0.1.0" }, "signIn")).toEqual([])
    expect(differences({ gives: "x" }, { gives: "x", methods: [{ id: "token" }] }, "signIn")).toEqual([])
  })

  it("fails on a command the catalog runs where the manifest says the CLI has none", () => {
    expect(differences(null, ["{profile}", "setup", "--json"], "setup")).toEqual(["setup"])
    expect(differences({ start: ["mcp"] }, { start: ["mcp"], config: ["mcp", "config"] }, "mcpServer")).toEqual([
      "mcpServer.config",
    ])
    expect(differences(undefined, { provider: "zoom" }, "meetings")).toEqual(["meetings"])
  })

  it("wants the catalog to name at least what the manifest says a sign-out removes", () => {
    expect(differences(["signIn"], ["signIn", "serverSession"], "accountRemove.removes")).toEqual([])
    expect(differences(["signIn"], [], "accountRemove.removes")).toEqual(["accountRemove.removes"])
    expect(differences(["settings"], ["folders"], "accountRemove.keeps")).toEqual([])
  })

  it("fails on a word, a program the package does not install, or a text", () => {
    expect(drift(manifest({ doctor: ["doctor", "--json"] })).join()).toContain("beeline doctor:")
    expect(drift({ ...manifest(), bins: ["wcat-beeline"] }).join()).toContain("Desktop runs beeline")
    expect(drift(manifest({ tagline: "Other words" })).join()).toContain("beeline tagline:")
    expect(drift(manifest({ sync: { last: ["runs", "list", "command:sync", "status:success"] } })).join()).toContain(
      "beeline sync.last",
    )
  })

  it("finds a command a Desktop catalog runs that the CLI's latest release no longer has", () => {
    const m = { ...manifest(), commands: ["session list", "doctor", "doctor reports show"] }
    const cat = (args: string[]) => ({
      tools: [{ id: "beeline", profiles: { args }, doctor: ["{profile}", "doctor"] }],
    })
    expect(missingCommands([beeline], {}, { beeline: m }, cat(["session", "list", "--json"]), "v0.8.0")).toEqual([])
    expect(missingCommands([beeline], {}, { beeline: m }, cat(["account", "list", "--json"]), "v0.8.0")).toEqual([
      "beeline profiles.args: Desktop v0.8.0 runs `account list --json`, @wirecat/beeline-cli 0.5.0 has no such command",
    ])
    expect(missingCommands([beeline], {}, { beeline: manifest() }, cat(["account", "list", "--json"]), "main")).toEqual(
      [],
    )
  })

  it("takes an allow line only with a reason and an end date or an issue", () => {
    const line = { tool: "beeline", key: "tagline", why: "Desktop words it its own way." }
    expect(allowProblems([{ ...line, until: "2027-01-31" }], "2026-11-25")).toEqual([])
    expect(
      allowProblems([{ ...line, issue: "https://github.com/WireCatLabs/beeline-cli/issues/7" }], "2026-11-25"),
    ).toEqual([])
    expect(allowProblems([line], "2026-11-25").join()).toContain('"until" date or the "issue"')
    expect(allowProblems([{ ...line, why: "Not checked yet", until: "2027-01-31" }], "2026-11-25").join()).toContain(
      "not a reason",
    )
    expect(allowProblems([{ ...line, until: "2026-11-24" }], "2026-11-25").join()).toContain("has passed")
    expect(allowProblems([{ ...line, issue: "https://example.com/1" }], "2026-11-25").join()).toContain("WireCatLabs")
  })

  it("lets a difference through only with a reason, and fails on a reason no longer needed", () => {
    const allowed = [{ tool: "beeline", key: "tagline", why: "FIND-282" }]
    expect(drift(manifest({ tagline: "Other words" }), allowed)).toEqual([])
    expect(drift(manifest(), allowed).join()).toContain("no longer differs")
  })

  it("wants a port for a new tool's MCP server, never one Desktop uses", () => {
    expect(drift(manifest({ mcpServer: { start: [] } }), [], { tools: [] }).join()).toContain('"mcpPort"')
    expect(portProblems({ beeline: { mcpPort: 8765 } }, { tools: [{ id: "tg", mcpServer: { port: 8765 } }] })).toEqual([
      "registry/official.json beeline: the MCP port 8765 is Desktop's tg",
    ])
  })

  it("fails when two manifests, or a manifest and the list or Desktop's catalog, name one MCP port", () => {
    const sms: Tool = { ...beeline, name: "sms", package: "@wirecat/sms-cli", repo: "WireCatLabs/sms-cli" }
    const all = [...tools, beeline, sms]
    const server = (port: number) => manifest({ mcpServer: { port, start: ["mcp", "server", "start"] } })
    const catalog = { tools: [{ id: "tg", mcpServer: { port: 8765 } }] }
    const check = (m: Manifests, o: Overlays = {}) => manifestPortProblems(all, o, m, catalog)

    expect(check({ beeline: server(8752), sms: server(8753) })).toEqual([])
    expect(check({ beeline: server(8752), sms: server(8752) })).toEqual([
      "sms: the MCP port 8752 in @wirecat/sms-cli's manifest is beeline's too",
    ])
    expect(check({ beeline: server(8765) })).toEqual(["tg: the MCP port 8765 in Desktop's catalog is beeline's too"])
    expect(check({ beeline: server(8752) }, { sms: { mcpPort: 8752 } })).toEqual([
      "sms: the MCP port 8752 in registry/official.json is beeline's too",
    ])
    expect(check({ beeline: server(8770) }).join()).toContain("it is from 8700 to 8769")
    expect(check({ tg: server(8765) }), "a tool's own catalog port is its own").toEqual([])
    expect(manifestPortProblems(tools, overlays, manifests, catalog)).toEqual([])
  })

  it("notices a release that changed its manifest or stopped shipping one", () => {
    const old = manifest()
    expect(staleProblems({ beeline: old }, { beeline: old })).toEqual([])
    expect(staleProblems({ beeline: old }, { beeline: { ...old, manifestSha256: "b".repeat(64) } }).join()).toContain(
      "ships another manifest",
    )
    expect(staleProblems({ beeline: old }, { beeline: null }).join()).toContain("ships no manifest")
  })

  it("reads one file out of a package without unpacking it", () => {
    const pkg = tgz({ "package/package.json": "{}", "package/contracts/wirecat.json": '{"wcat_manifest":2}' })
    expect(tarEntry(pkg, "contracts/wirecat.json")?.toString()).toBe('{"wcat_manifest":2}')
    expect(tarEntry(pkg, "contracts/other.json")).toBeNull()
  })
})
