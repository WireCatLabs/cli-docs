/** Check published releases and prepare source snapshots without approving translations. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { syncTool, type Tool } from "./sync.ts"

export type ReleaseUpdate = {
  tool: string
  repo: string
  current: string
  latest: string
  npm: string
  published: boolean
  releaseUrl: string
  compareUrl: string
  pages: string[]
  changesComplete: boolean
  review: string[]
}
export const stableVersion = (tag: string): number[] => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(tag)
  if (!match) throw new Error(`Not a stable release version: ${tag}`)
  return match.slice(1).map(Number)
}
export const newerVersion = (latest: string, current: string): boolean => {
  const a = stableVersion(latest),
    b = stableVersion(current)
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i]
  return false
}
export const publishedTogether = (tag: string, npm: string): boolean =>
  stableVersion(tag).join(".") === stableVersion(npm).join(".")

type JsonRequest = (url: string, init?: RequestInit) => Promise<unknown>
type Release = { draft: boolean; prerelease: boolean; published_at: string; tag_name: string }
type Compare = { files?: { filename: string; status: string; previous_filename?: string }[] }
type Issue = { number: number; title: string; body?: string; pull_request?: unknown }
type TaskMap = { id: string; pages: string[]; families: Record<string, string[]> }
export function affectedDocumentationTasks(paths: string[], tool: string, tasks: TaskMap[]): string[] {
  return tasks
    .filter((task) =>
      paths.some((path) => {
        if (path === "package.json") return true
        if (task.pages.some((page) => page.startsWith(`${tool}/`) && path === `docs/${page.slice(tool.length + 1)}`))
          return true
        return (task.families[tool] ?? []).some((family) =>
          new RegExp(`^src/${family}(?:/|$)|^src/(?:commands|services)/${family}(?:[./-]|$)`).test(path),
        )
      }),
    )
    .map((task) => task.id)
}
export const requestJson: JsonRequest = async (url, init = {}) => {
  const headers: Record<string, string> = { Accept: "application/json", "User-Agent": "wirecat-docs-updates" }
  if (new URL(url).hostname === "api.github.com") {
    headers["X-GitHub-Api-Version"] = "2022-11-28"
    if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`
  }
  const response = await fetch(url, {
    ...init,
    headers: { ...headers, ...init.headers },
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok) throw new Error(`${new URL(url).hostname}: request failed (${response.status})`)
  return response.status === 204 ? null : response.json()
}
export const releaseChanges = (files: { filename: string; status: string; previous_filename?: string }[]): string[] =>
  [...new Set(files.flatMap((file) => [file.filename, ...(file.previous_filename ? [file.previous_filename] : [])]))]
    .filter((path) => /^(docs\/[a-z0-9-]+\.md|docs\/meta\.json|CHANGELOG\.md)$/.test(path))
    .sort()

export async function checkToolRelease(tool: Tool, getJson: JsonRequest = requestJson): Promise<ReleaseUpdate | null> {
  if (!tool.docsRef) throw new Error(`${tool.name}: docsRef is required for release auditing`)
  if (!/^[\w.-]+\/[\w.-]+$/.test(tool.repo)) throw new Error("Invalid repository")
  const [releaseResponse, npmResponse] = await Promise.all([
    getJson(`https://api.github.com/repos/${tool.repo}/releases/latest`),
    getJson(`https://registry.npmjs.org/${encodeURIComponent(tool.package)}/latest`),
  ])
  const release = releaseResponse as Release
  const npm = npmResponse as { version: string }
  if (release.draft || release.prerelease || !release.published_at)
    throw new Error(`${tool.name}: release is not published and stable`)
  if (newerVersion(tool.docsRef, release.tag_name))
    throw new Error(`${tool.name}: latest release is older than the reviewed docs`)
  if (!newerVersion(release.tag_name, tool.docsRef) && publishedTogether(release.tag_name, npm.version)) return null
  const compare = `${tool.docsRef}...${release.tag_name}`
  const delta = (await getJson(`https://api.github.com/repos/${tool.repo}/compare/${compare}`)) as Compare
  const pages = releaseChanges(delta.files ?? [])
  const complete = (delta.files?.length ?? 0) < 300
  const taskMaps = JSON.parse(readFileSync(new URL("../docs/tasks.json", import.meta.url), "utf8")) as TaskMap[]
  const affectedTasks = affectedDocumentationTasks(delta.files?.map((file) => file.filename) ?? [], tool.name, taskMaps)
  return {
    tool: tool.name,
    repo: tool.repo,
    current: tool.docsRef,
    latest: release.tag_name,
    npm: npm.version,
    published: publishedTogether(release.tag_name, npm.version),
    releaseUrl: `https://github.com/${tool.repo}/releases/tag/${release.tag_name}`,
    compareUrl: `https://github.com/${tool.repo}/compare/${compare}`,
    pages,
    changesComplete: complete,
    review: [
      ...(complete ? [] : ["GitHub may have truncated the changed-file list; inspect the full comparison."]),
      ...(affectedTasks.length
        ? [`Potentially affected tasks: ${affectedTasks.join(", ")}. Review their guides, source claims and diagrams.`]
        : []),
      ...pages
        .filter((path) => path !== "docs/meta.json" && path !== "docs/README.md")
        .map((path) => `${path}: review translations, correction matches, examples and incoming anchors`),
      "Check that CHANGELOG.md contains this released version, and review docs/roadmap.md even when plans are unchanged. Update docs/release-notes-review.json for the chosen docsRef and run pnpm docs:release-notes.",
      "Check shared installation, scenario adapters and copied playground commands against released CLI help.",
      "Refresh pnpm docs:contracts and run pnpm docs:check against the reviewed release.",
      "Run pnpm docs:localize, lint, test, search:check, typecheck, build, check:links and browser tests.",
    ],
  }
}
export function updateReport(updates: ReleaseUpdate[]): string {
  if (!updates.length)
    return "# Documentation release check\n\nBoth documentation versions match the latest published stable releases.\n"
  return `# Documentation releases needing review\n\nThis report does not approve translations or publish the site.\n\n${updates
    .map(
      (update) =>
        `## ${update.tool}: ${update.current} → ${update.latest}\n\n[Release](${update.releaseUrl}) · [Source comparison](${update.compareUrl})\n\nnpm: ${update.npm}. ${update.published ? "GitHub and npm agree; source preparation is available." : "GitHub and npm differ; wait for publication before changing docsRef."}\n\nChanged documentation files:\n\n${update.pages.length ? update.pages.map((path) => `- ${path}`).join("\n") : "- No public guide content changed; check release links and fingerprints."}\n\nReview checklist:\n\n${update.review.map((item) => `- [ ] ${item}`).join("\n")}`,
    )
    .join(
      "\n\n",
    )}\n\nTo prepare sources in an isolated checkout: \`pnpm docs:updates --prepare\`. Review changed translations and errata before updating fingerprints. CI continues to reject stale or missing translations.\n`
}
const issueTitle = "[Docs] Review released CLI updates"
const marker = "<!-- wirecat-docs-release-check -->"
export async function notifyUpdates(
  repo: string,
  updates: ReleaseUpdate[],
  getJson: JsonRequest = requestJson,
): Promise<void> {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error("Invalid notification repository")
  const url = `https://api.github.com/repos/${repo}/issues`
  // A fixed title + marker identifies this automation's issue; unrelated issues are never edited.
  const issues = (await getJson(`${url}?state=open&creator=github-actions%5Bbot%5D&per_page=100`)) as Issue[]
  const existing = issues.find(
    (item) => !item.pull_request && item.title === issueTitle && item.body?.startsWith(marker),
  )
  if (!updates.length) {
    if (existing)
      await getJson(`${url}/${existing.number}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: "closed" }),
      })
    return
  }
  const body = `${marker}\n\n${updateReport(updates)}`
  if (existing?.body === body) return
  await getJson(existing ? `${url}/${existing.number}` : url, {
    method: existing ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: issueTitle, body }),
  })
}

export function prepareUpdates(root: string, tools: Tool[], updates: ReleaseUpdate[], capture = syncTool): void {
  if (updates.some((update) => !update.published))
    throw new Error("Release publication is incomplete; no version pins changed")
  const proposed = tools.map((tool) => ({ ...tool }))
  for (const update of updates) {
    const tool = proposed.find((tool) => tool.name === update.tool)
    if (!tool || tool.docsRef !== update.current || !newerVersion(update.latest, update.current))
      throw new Error("Release proposal is stale or would not advance the reviewed version")
    // A new release must be reviewed in full, without old prose hiding changed guide content.
    delete tool.guideRefs
    capture({ ...tool, docsRef: update.latest }, root, undefined, true)
    tool.docsRef = update.latest
  }
  if (updates.length) writeFileSync(join(root, "tools.json"), `${JSON.stringify(proposed, null, 2)}\n`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const { values } = parseArgs({ options: { prepare: { type: "boolean" }, notify: { type: "boolean" } } })
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as Tool[]
  const updates = (await Promise.all(tools.map((tool) => checkToolRelease(tool)))).filter(
    (row): row is ReleaseUpdate => row !== null,
  )
  const output = join(root, ".docs-updates")
  mkdirSync(output, { recursive: true })
  writeFileSync(join(output, "updates.json"), `${JSON.stringify(updates, null, 2)}\n`)
  writeFileSync(join(output, "report.md"), updateReport(updates))
  console.log(updateReport(updates))
  if (values.prepare) {
    prepareUpdates(root, tools, updates)
    console.log(
      "Source snapshots prepared. Translation fingerprints and corrections remain unchanged; review them before publishing.",
    )
  }
  if (values.notify) {
    if (!process.env.GH_TOKEN || !process.env.GITHUB_REPOSITORY)
      throw new Error("Notification requires GH_TOKEN and GITHUB_REPOSITORY")
    await notifyUpdates(process.env.GITHUB_REPOSITORY, updates)
  }
}
