/**
 * The community tools WireCat Desktop may offer: every `"community": true` entry of tools.json with a `desktop`
 * object, as the catalog entry the app reads. The deploy signs the file with minisign and serves it at
 * `https://wirecat.dev/registry/v1/desktop-tools.json`; the app checks it again with its own rules
 * (wirecat-desktop `src-tauri/src/community.rs`), which these mirror so a pull request fails here first.
 *
 *   node --experimental-strip-types scripts/desktop-registry.ts [--out out/registry/v1/desktop-tools.json]
 *
 * No npm imports: the deploy runs it in the job that holds the signing key, where nothing is installed.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import type { Tool } from "./sync.ts"

export const REGISTRY_URL = "https://wirecat.dev/registry/v1/desktop-tools.json"
const LIFETIME_DAYS = 30
const MAX_TOOLS = 32

/** Every key the app's catalog entry has; `null` when the tool has no such command. */
const REQUIRED = [
  "tagline",
  "bin",
  "profiles",
  "doctor",
  "runs",
  "search",
  "setup",
  "signIn",
  "skill",
  "mcpServer",
  "tasks",
  "sync",
  "storeInfo",
  "storeTables",
  "storeTableSizes",
  "storeCheck",
  "storeBackup",
  "storeBackupEncrypted",
  "storage",
  "settings",
] as const
const OPTIONAL = ["background", "permissions"] as const
/** Filled from the entry itself, so the site and the app never disagree on them. */
const FROM_ENTRY = ["id", "name", "community", "package", "repo", "summary", "docs"]
/** Only WireCat's own tools may set these: parts of our packages, memo's pages, bot tokens, emptying the shared store. */
const OURS_ONLY = [
  "partOf",
  "commandPrefix",
  "memory",
  "taskBoard",
  "bot",
  "storeReset",
  "storeResetPreview",
  "configRepair",
]
/** Ids the app has that are not tools.json entries of their own (memo's email part). */
const APP_ONLY_IDS = ["email"]

export type Desktop = Record<string, unknown>

/**
 * A word the app runs as one argument without a shell (`setup` is joined into a shell line): letters, digits and
 * `._:=,/+@-`, at most two leading dashes, `--` alone, and `{name}` slots. Same rule as community.rs `plain_word`.
 */
export const plainWord = (w: string): boolean => {
  if (w === "--") return true
  const [head = "", ...parts] = w.split("{")
  let rest = head
  for (const part of parts) {
    const end = part.indexOf("}")
    if (end < 0 || !/^[A-Za-z]+$/.test(part.slice(0, end))) return false
    rest += `x${part.slice(end + 1)}`
  }
  const body = rest.replace(/^-+/, "")
  return w.length <= 100 && rest.length - body.length <= 2 && /^[A-Za-z0-9][A-Za-z0-9._:=,/+@-]*$/.test(body)
}

const plainName = (s: unknown, min: number, max: number) =>
  typeof s === "string" && s.length >= min && s.length <= max && /^[a-z][a-z0-9-]*$/.test(s)

function badWords(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") {
        if (!plainWord(item)) out.push(item)
      } else badWords(item, out)
    }
  } else if (value && typeof value === "object") for (const v of Object.values(value)) badWords(v, out)
  return out
}

const record = (v: unknown): Record<string, unknown> | undefined =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : undefined

/** What makes one entry's `desktop` object unfit for the app, without looking at the other entries. */
export function desktopProblems(tool: Tool): string[] {
  const desktop: unknown = tool.desktop
  if (desktop === undefined) return []
  const at = `${tool.name} desktop`
  const d = record(desktop)
  if (!d) return [`${at}: is an object`]
  if (tool.community !== true) return [`${at}: only a community entry has one; ours are in wirecat-desktop`]
  const problems: string[] = []
  if (!/^[a-z]{2,16}$/.test(tool.name)) problems.push(`${tool.name}: the app needs a name of 2 to 16 lowercase letters`)
  const pkg = /^@([a-z0-9][a-z0-9._-]{0,63})\/([a-z0-9][a-z0-9._-]{0,63})$/.exec(tool.package)
  if (!pkg) problems.push(`${tool.name}: the package is a scoped npm name (@scope/name)`)
  if (!/^[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}$/.test(tool.repo) || /(^|\/)\./.test(tool.repo))
    problems.push(`${tool.name}: the repository is <owner>/<name> on GitHub`)
  for (const key of Object.keys(d)) {
    if (FROM_ENTRY.includes(key)) problems.push(`${at}: "${key}" comes from the entry itself; remove it here`)
    else if (OURS_ONLY.includes(key)) problems.push(`${at}: a community tool cannot set "${key}"`)
    else if (!(REQUIRED as readonly string[]).includes(key) && !(OPTIONAL as readonly string[]).includes(key))
      problems.push(`${at}: the app has no "${key}"`)
  }
  for (const key of REQUIRED) if (d[key] === undefined) problems.push(`${at}: "${key}" is missing (null when unused)`)
  if (typeof d.tagline !== "string" || d.tagline.length > 55) problems.push(`${at}: "tagline" is at most 55 characters`)
  if (!plainName(d.bin, 1, 32)) problems.push(`${at}: "bin" is a lowercase program name`)
  if (!Array.isArray(d.doctor)) problems.push(`${at}: "doctor" is a list of words`)
  const signIn = record(d.signIn)
  if (signIn && "command" in signIn)
    problems.push(`${at}: a community tool cannot show a command to copy (signIn.command)`)
  const guide = signIn?.guide
  if (guide !== undefined && (typeof guide !== "string" || !/^https:\/\/\S+$/.test(guide)))
    problems.push(`${at}: signIn.guide is an https address`)
  const storage = record(d.storage)
  if (!storage || !plainName(storage.app, 2, 32) || !/^[A-Z][A-Z0-9_]{1,31}$/.test(String(storage.env)))
    problems.push(`${at}: "storage" is { app: a lowercase folder name, env: an uppercase prefix }`)
  for (const word of badWords(d)) problems.push(`${at}: the command word ${JSON.stringify(word)} is not allowed`)
  return problems
}

/** Names, programs, packages and data folders the app's own tools use; the app deletes a tool's folders by name. */
function reserved(tools: readonly Tool[]) {
  const ours = tools.filter((t) => t.community !== true)
  const ids = new Set([...ours.map((t) => t.name), ...APP_ONLY_IDS])
  const folders = new Set(["wirecat"])
  for (const t of ours) {
    folders.add(t.name)
    folders.add(t.repo.split("/")[1]?.toLowerCase() ?? "")
  }
  return { ids, bins: new Set(ids), packages: new Set(ours.map((t) => t.package)), folders }
}

/** What makes the `desktop` entries unfit together: a name, program, package or data folder of ours or used twice. */
export function registryProblems(tools: readonly Tool[]): string[] {
  const taken = reserved(tools)
  const problems: string[] = []
  const listed = tools.filter((t) => t.community === true && record(t.desktop) !== undefined)
  if (listed.length > MAX_TOOLS) problems.push(`the app reads only the first ${MAX_TOOLS} desktop entries`)
  for (const tool of listed) {
    const d = tool.desktop as Desktop
    const storage = record(d.storage) ?? {}
    const folders = [String(storage.app ?? "").toLowerCase(), String(storage.env ?? "").toLowerCase()]
    if (taken.ids.has(tool.name)) problems.push(`${tool.name}: the name is taken`)
    if (taken.bins.has(String(d.bin))) problems.push(`${tool.name}: the program ${String(d.bin)} is taken`)
    if (taken.packages.has(tool.package)) problems.push(`${tool.name}: the package ${tool.package} is taken`)
    if (folders.some((f) => taken.folders.has(f)))
      problems.push(`${tool.name}: the data folder ${String(storage.app)} or prefix ${String(storage.env)} is used`)
    taken.ids.add(tool.name)
    taken.bins.add(String(d.bin))
    taken.packages.add(tool.package)
    for (const f of folders) taken.folders.add(f)
  }
  return problems
}

/** The app's catalog entry: the desktop object, with the fields the site already holds filled from the entry. */
export const registryEntry = (tool: Tool & { desktop: Desktop }) => ({
  id: tool.name,
  community: true,
  name: tool.displayName ?? tool.name,
  package: tool.package,
  repo: `https://github.com/${tool.repo}`,
  summary: tool.summary.en ?? Object.values(tool.summary)[0] ?? "",
  docs: `https://wirecat.dev/docs/${tool.name}`,
  ...tool.desktop,
  storeResetPreview: null,
  storeReset: null,
})

/**
 * `version` is the build time in seconds, so every deploy's list is newer than the one before; the app never takes a
 * lower one. `expires_at` makes a list the deploy stopped refreshing stop working rather than linger.
 */
export function buildRegistry(tools: readonly Tool[], now: Date) {
  const problems = [...tools.flatMap(desktopProblems), ...registryProblems(tools)]
  if (problems.length) throw new Error(`tools.json:\n${problems.join("\n")}`)
  const listed = tools.filter(
    (t): t is Tool & { desktop: Desktop } => t.community === true && record(t.desktop) !== undefined,
  )
  return {
    format: 1,
    version: Math.floor(now.getTime() / 1000),
    generated_at: now.toISOString(),
    expires_at: new Date(now.getTime() + LIFETIME_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    tools: listed.map(registryEntry),
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const { values } = parseArgs({ options: { out: { type: "string", default: "out/registry/v1/desktop-tools.json" } } })
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as Tool[]
  const registry = buildRegistry(tools, new Date())
  const out = resolve(root, values.out)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, `${JSON.stringify(registry, null, 2)}\n`)
  console.log(`${out}: ${registry.tools.length} community tools, version ${registry.version}`)
}
