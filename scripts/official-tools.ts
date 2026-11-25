/**
 * WireCat's own tools in the signed list WireCat Desktop fetches (desktop-registry.ts, its `official` array), and the
 * check that the list, Desktop's compiled catalog and each published CLI still say the same.
 *
 *   node --experimental-strip-types scripts/official-tools.ts           # refresh registry/official-manifests.json
 *   node --experimental-strip-types scripts/official-tools.ts --check   # fail when npm or Desktop's catalog drifted
 *
 * Facts about a CLI come from its own manifest, `contracts/wirecat.json` in the npm package of its latest release:
 * the same `desktop` object its `--wcat-describe` prints (cli-base docs/REFERENCE.md), read without running the
 * package. The manifests are committed, so the job that signs the list reads only reviewed files and fetches nothing.
 * What a manifest has no place for (the Desktop id, translations, an icon, an MCP port, a sign-in screen of the app's
 * own) is in registry/official.json.
 *
 * No npm imports, like desktop-registry.ts.
 */
import { createHash } from "node:crypto"
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { gunzipSync } from "node:zlib"
import type { Tool } from "./sync.ts"

export const MANIFESTS_FILE = "registry/official-manifests.json"
export const OVERLAY_FILE = "registry/official.json"
export const DRIFT_ALLOW_FILE = "registry/drift-allow.json"
export const DESKTOP_CATALOG_URL =
  "https://raw.githubusercontent.com/WireCatLabs/wirecat-desktop/main/catalog/tools.json"
const NPM = "https://registry.npmjs.org/"
const LANGS = ["en", "ru", "es"] as const
const TEXTS = ["name", "tagline", "summary", "gives", "asks", "syncNote"] as const
/** Desktop's ports for MCP servers it starts; an own tool gets one from 8770 up, so ours stay below. */
const PORTS = [8700, 8769] as const
const MAX_ICON = 2048
const BOT_SCREENS = ["tg", "max", "wa"]

export type Manifest = {
  version: string
  manifestSha256: string
  bin: string
  /** Every program the package installs: Desktop runs our tools by their short name, the manifest names `wcat-…`. */
  bins: string[]
  desktop: Record<string, unknown>
}
/** By tools.json name; `null` when the latest release ships no manifest. */
export type Manifests = Record<string, Manifest | null>

export type Overlay = {
  /** Desktop's id when it is not the tools.json name (`b24` is `bitrix` there). */
  id?: string
  name?: string
  icon?: string
  mcpPort?: number
  /** A Desktop id whose own sign-in screens this tool uses (Bitrix24's, Asterisk's); never a bot's, see below. */
  screen?: string
  i18n?: Partial<Record<(typeof LANGS)[number], Partial<Record<(typeof TEXTS)[number], string>>>>
}
export type Overlays = Record<string, Overlay>

export type Allowed = { tool: string; key: string; why: string }

const record = (v: unknown): Record<string, unknown> | undefined =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined

export const ours = (tools: readonly Tool[]) => tools.filter((t) => t.community !== true)

/** One SVG path drawn in the app's own colour on a 24 x 24 box: path commands and numbers, nothing that loads. */
export const iconPath = (d: string) => d.length <= MAX_ICON && /^[MmLlHhVvCcSsQqTtAaZz0-9 ,.eE-]+$/.test(d)

export function overlayProblems(tools: readonly Tool[], overlays: Overlays): string[] {
  const names = new Set(ours(tools).map((t) => t.name))
  const problems: string[] = []
  const ids = new Map<string, string>()
  const ports = new Map<number, string>()
  for (const [name, o] of Object.entries(overlays)) {
    const at = `${OVERLAY_FILE} ${name}`
    if (!names.has(name)) problems.push(`${at}: no tool of ours in tools.json has this name`)
    const id = o.id ?? name
    if (!/^[a-z]{2,16}$/.test(id)) problems.push(`${at}: the Desktop id is 2 to 16 lowercase letters`)
    if (o.icon !== undefined && !iconPath(o.icon))
      problems.push(`${at}: the icon is one SVG path of commands and numbers, at most ${MAX_ICON} characters`)
    if (o.screen !== undefined && !/^[a-z]{2,16}$/.test(o.screen)) problems.push(`${at}: the screen is a Desktop id`)
    // The bots' screens need the catalog's `bot` block, which only a compiled-in tool may have.
    if (o.screen !== undefined && BOT_SCREENS.includes(o.screen))
      problems.push(`${at}: the ${o.screen} sign-in screens need a bot, which only a tool built into Desktop has`)
    if (o.mcpPort !== undefined) {
      if (!Number.isInteger(o.mcpPort) || o.mcpPort < PORTS[0] || o.mcpPort > PORTS[1])
        problems.push(`${at}: the MCP port is from ${PORTS[0]} to ${PORTS[1]}`)
      const other = ports.get(o.mcpPort)
      if (other) problems.push(`${at}: the MCP port ${o.mcpPort} is ${other}'s`)
      ports.set(o.mcpPort, name)
    }
    for (const [lang, texts] of Object.entries(o.i18n ?? {})) {
      if (!(LANGS as readonly string[]).includes(lang)) problems.push(`${at}: Desktop reads en, ru and es only`)
      for (const [key, text] of Object.entries(texts ?? {})) {
        if (!(TEXTS as readonly string[]).includes(key)) problems.push(`${at}: i18n.${lang} has no "${key}"`)
        if (typeof text !== "string" || text.trim() === "") problems.push(`${at}: i18n.${lang}.${key} is a text`)
        if (key === "tagline" && String(text).length > 55) problems.push(`${at}: i18n.${lang}.tagline is 55 at most`)
      }
    }
    const other = ids.get(id)
    if (other) problems.push(`${at}: the Desktop id ${id} is ${other}'s too`)
    ids.set(id, name)
  }
  return problems
}

/**
 * Desktop's entry for each of our tools whose latest release ships a manifest. The manifest's `desktop` object goes
 * as published: Desktop turns it into a catalog entry the way it does for an own tool. A tool Desktop has compiled in
 * takes only `i18n`, `icon` and `screen` from its entry, so `i18n` holds only what official.json says, English too;
 * the site's summaries are `summaries`, for a tool Desktop does not have yet.
 */
export function officialEntries(tools: readonly Tool[], overlays: Overlays, manifests: Manifests) {
  const problems = overlayProblems(tools, overlays)
  if (problems.length) throw new Error(problems.join("\n"))
  return ours(tools).flatMap((tool) => {
    const m = manifests[tool.name]
    if (!m) return []
    const o = overlays[tool.name] ?? {}
    return [
      {
        id: o.id ?? tool.name,
        ...((o.name ?? tool.displayName) ? { name: o.name ?? tool.displayName } : {}),
        package: tool.package,
        repo: `https://github.com/${tool.repo}`,
        docs: `https://wirecat.dev/en/docs/${tool.name}`,
        summary: tool.summary.en ?? "",
        summaries: tool.summary,
        bin: m.bin,
        version: m.version,
        manifestSha256: m.manifestSha256,
        desktop: m.desktop,
        ...(o.mcpPort ? { mcpPort: o.mcpPort } : {}),
        ...(o.icon ? { icon: o.icon } : {}),
        ...(o.screen ? { screen: o.screen } : {}),
        ...(o.i18n ? { i18n: o.i18n } : {}),
      },
    ]
  })
}

/** The bytes of `path` inside a .tgz, read without unpacking anything to disk. */
export function tarEntry(tgz: Uint8Array, path: string): Buffer | null {
  const tar = gunzipSync(tgz)
  let at = 0
  let longName: string | null = null
  while (at + 512 <= tar.length) {
    const header = tar.subarray(at, at + 512)
    if (header.every((b) => b === 0)) return null
    const field = (from: number, to: number) => header.subarray(from, to).toString("utf8").replace(/\0.*$/s, "")
    const size = Number.parseInt(field(124, 136).trim() || "0", 8)
    const type = field(156, 157)
    const prefix = field(345, 500)
    const name = longName ?? (prefix ? `${prefix}/${field(0, 100)}` : field(0, 100))
    const body = tar.subarray(at + 512, at + 512 + size)
    longName = null
    if (type === "L") longName = body.toString("utf8").replace(/\0.*$/s, "")
    else if (type === "x") {
      const pax = /\d+ path=([^\n]*)\n/.exec(body.toString("utf8"))
      if (pax?.[1]) longName = pax[1]
    } else if ((type === "0" || type === "") && name.replace(/^[^/]+\//, "") === path) return Buffer.from(body)
    at += 512 + Math.ceil(size / 512) * 512
  }
  return null
}

const sri = (bytes: Uint8Array) => `sha512-${createHash("sha512").update(bytes).digest("base64")}`

/** npm and GitHub reset a connection now and then; three tries before a run fails on it. */
async function retried<T>(run: () => Promise<T>, tries = 3): Promise<T> {
  for (let n = 1; ; n++) {
    try {
      return await run()
    } catch (e) {
      if (n >= tries) throw e
      await new Promise((r) => setTimeout(r, 2000 * n))
    }
  }
}

const getJson = (url: string) =>
  retried(async () => {
    const res = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(30_000) })
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
    return (await res.json()) as Record<string, unknown>
  })

/** The manifest of the package's latest release, its tarball checked against npm's integrity first. */
export async function fetchManifest(pkg: string): Promise<Manifest | null> {
  const latest = await getJson(`${NPM}${pkg.replace("/", "%2F")}/latest`)
  const dist = record(latest.dist) ?? {}
  const tarball = String(dist.tarball ?? "")
  if (!tarball.startsWith(NPM)) throw new Error(`${pkg}: npm gives no package file on registry.npmjs.org`)
  const bytes = await retried(async () => {
    const res = await fetch(tarball, { signal: AbortSignal.timeout(60_000) })
    if (!res.ok) throw new Error(`${pkg}: the package file answered HTTP ${res.status}`)
    return new Uint8Array(await res.arrayBuffer())
  })
  if (sri(bytes) !== dist.integrity) throw new Error(`${pkg}: the package file does not match npm's integrity`)
  const raw = tarEntry(bytes, "contracts/wirecat.json")
  if (!raw) return null
  const m = JSON.parse(raw.toString("utf8")) as Record<string, unknown>
  if (m.wcat_manifest !== 2 || m.package !== pkg || !record(m.desktop))
    throw new Error(`${pkg}: contracts/wirecat.json is not a format 2 manifest of this package`)
  return {
    version: String(latest.version),
    manifestSha256: createHash("sha256").update(raw).digest("hex"),
    bin: String(m.bin),
    bins: Object.keys(record(latest.bin) ?? {}).sort(),
    desktop: m.desktop as Record<string, unknown>,
  }
}

/** Four packages at a time: some are tens of megabytes. */
export async function fetchManifests(tools: readonly Tool[]): Promise<Manifests> {
  const queue = [...ours(tools)]
  const out: [string, Manifest | null][] = []
  const worker = async () => {
    for (let t = queue.shift(); t; t = queue.shift()) out.push([t.name, await fetchManifest(t.package)])
  }
  await Promise.all([worker(), worker(), worker(), worker()])
  return Object.fromEntries(out.sort(([a], [b]) => a.localeCompare(b)))
}

/** A release changed its manifest, started or stopped shipping one: the committed copy is behind npm. */
export function staleProblems(committed: Manifests, live: Manifests): string[] {
  const problems: string[] = []
  for (const name of new Set([...Object.keys(committed), ...Object.keys(live)])) {
    const was = committed[name] ?? null
    const now = live[name] ?? null
    if (was?.manifestSha256 !== now?.manifestSha256)
      problems.push(
        `${name}: npm's latest release ${now ? `${now.version} ships another manifest` : "ships no manifest"} than ${MANIFESTS_FILE} holds${was ? ` (${was.version})` : ""}`,
      )
  }
  return problems
}

/** The keys a manifest states about the CLI that Desktop's compiled catalog also holds. */
const FACTS = [
  "storage",
  "doctor",
  "setup",
  "profiles",
  "runs",
  "skill",
  "mcpServer",
  "sync.run",
  "sync.last",
  "signIn.methods",
  "signIn.setupFrom",
  "accountRemove",
  "meetings",
] as const
/** What the person reads. */
const WORDS = ["tagline", "signIn.gives", "signIn.asks"] as const
/**
 * cli-base always writes `0.0.0` (its schema allows no other value), since a manifest ships inside the version it
 * describes; Desktop keeps its own: the first version it offers the flow for.
 */
const IGNORED = ["accountRemove.remove.minVersion", "signIn.setupFrom"]

const at = (v: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((o, k) => (record(o) ? (o as Record<string, unknown>)[k] : undefined), v)

/**
 * The paths under `path` where the catalog says something else than the manifest. Only what the manifest states is
 * compared: a key it leaves out or sets to `null` says nothing, and a key only the catalog has (`mcpServer.port`) is
 * Desktop's own. Word lists are compared as they are, since one argument is not two.
 */
export function differences(said: unknown, has: unknown, path: string): string[] {
  if (said === null || said === undefined || IGNORED.includes(path)) return []
  const s = record(said)
  if (s) {
    const h = record(has)
    if (!h) return [path]
    return Object.entries(s).flatMap(([k, v]) => differences(v, h[k], `${path}.${k}`))
  }
  return JSON.stringify(said) === JSON.stringify(has) ? [] : [path]
}

/**
 * Where Desktop's compiled catalog says something else than the CLI's own manifest, and a catalog program the package
 * does not install. Each difference must be fixed or written into drift-allow.json with why; a line there that no
 * longer differs fails too, so the file stays the list of what is still open.
 */
export function driftProblems(
  tools: readonly Tool[],
  overlays: Overlays,
  manifests: Manifests,
  catalog: { tools: Record<string, unknown>[] },
  allowed: readonly Allowed[],
): string[] {
  const problems: string[] = []
  const used = new Set<string>()
  const report = (id: string, key: string, text: string) => {
    if (allowed.some((a) => a.tool === id && a.key === key)) used.add(`${id} ${key}`)
    else problems.push(`${id} ${key}: ${text}`)
  }
  for (const tool of ours(tools)) {
    const m = manifests[tool.name]
    if (!m) continue
    const id = overlays[tool.name]?.id ?? tool.name
    const entry = catalog.tools.find((t) => t.id === id)
    if (!entry) {
      if (record(m.desktop.mcpServer) && overlays[tool.name]?.mcpPort === undefined)
        problems.push(`${id}: Desktop has no port for its MCP server yet; give it an "mcpPort" in ${OVERLAY_FILE}`)
      continue
    }
    if (!m.bins.includes(String(entry.bin)))
      report(id, "bin", `Desktop runs ${String(entry.bin)}, ${tool.package} ${m.version} installs ${m.bins.join(", ")}`)
    for (const key of [...FACTS, ...WORDS]) {
      const said = at(m.desktop, key)
      const has = at(entry, key)
      for (const path of differences(said, has, key))
        report(
          id,
          path,
          `Desktop's catalog has ${JSON.stringify(at(entry, path))}, ${tool.package} ${m.version} says ${JSON.stringify(at(m.desktop, path))}`,
        )
    }
  }
  for (const a of allowed)
    if (!used.has(`${a.tool} ${a.key}`))
      problems.push(`${DRIFT_ALLOW_FILE}: ${a.tool} ${a.key} no longer differs; remove the line`)
  return problems
}

/** A port the list gives a new tool must not be one Desktop's catalog already uses. */
export function portProblems(overlays: Overlays, catalog: { tools: Record<string, unknown>[] }): string[] {
  const taken = new Map(
    catalog.tools.flatMap((t) => {
      const port = at(t, "mcpServer.port")
      return typeof port === "number" ? [[port, String(t.id)] as const] : []
    }),
  )
  return Object.entries(overlays).flatMap(([name, o]) => {
    const id = o.id ?? name
    const owner = o.mcpPort === undefined ? undefined : taken.get(o.mcpPort)
    return owner && owner !== id ? [`${OVERLAY_FILE} ${name}: the MCP port ${o.mcpPort} is Desktop's ${owner}`] : []
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const read = <T>(file: string) => JSON.parse(readFileSync(join(root, file), "utf8")) as T
  const { values } = parseArgs({ options: { check: { type: "boolean", default: false } } })
  const tools = read<Tool[]>("tools.json")
  const overlays = read<Overlays>(OVERLAY_FILE)
  const live = await fetchManifests(tools)
  if (!values.check) {
    writeFileSync(join(root, MANIFESTS_FILE), `${JSON.stringify(live, null, 2)}\n`)
    const shipped = Object.values(live).filter(Boolean).length
    console.log(`${MANIFESTS_FILE}: ${shipped} of ${Object.keys(live).length} tools ship a manifest`)
  } else {
    const committed = read<Manifests>(MANIFESTS_FILE)
    const catalog = (await getJson(DESKTOP_CATALOG_URL)) as { tools: Record<string, unknown>[] }
    const stale = staleProblems(committed, live)
    const drift = [
      ...overlayProblems(tools, overlays),
      ...portProblems(overlays, catalog),
      ...driftProblems(tools, overlays, live, catalog, read<Allowed[]>(DRIFT_ALLOW_FILE)),
    ]
    for (const name of Object.keys(live).filter((n) => !live[n])) console.log(`gap  ${name}: ships no manifest yet`)
    for (const p of stale) console.log(`stale  ${p}`)
    for (const p of drift) console.log(`drift  ${p}`)
    if (stale.length) console.log("Run `pnpm registry:official` and commit registry/official-manifests.json.")
    if (stale.length || drift.length) process.exit(1)
    console.log("The signed list, Desktop's catalog and the published CLIs agree.")
  }
}
