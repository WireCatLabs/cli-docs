/**
 * Fills `content/docs/<tool>/` from each tool's repository at its newest release tag: the pages in
 * `docs/`, its `meta.json` sidebar and the changelog. Never `main` — it can describe what is not
 * released yet.
 *
 *   pnpm sync
 *   pnpm sync --ref main    a preview of what the next release will show; never for the published site
 */
import { execFileSync } from "node:child_process"
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, normalize } from "node:path"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"
import { structureProblems } from "@leemour/cli-core/release"
import { captureUpstream, localizeTool } from "./localize.ts"

export type Tool = {
  name: string
  repo: string
  package: string
  lang: string
  summary: Record<string, string>
}

const VERSION_TAG = /^refs\/tags\/v(\d+)\.(\d+)\.(\d+)$/

/** The newest `vX.Y.Z` in `git ls-remote --tags` output, compared as versions, not as text. */
export const latestTag = (lsRemote: string): string | undefined => {
  const versions = lsRemote
    .split("\n")
    .map((line) => VERSION_TAG.exec(line.split("\t")[1] ?? ""))
    .filter((found): found is RegExpExecArray => found !== null)
    .map((found) => [Number(found[1]), Number(found[2]), Number(found[3])] as const)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
  const newest = versions.at(-1)
  return newest ? `v${newest.join(".")}` : undefined
}

type Context = {
  repo: string
  tag: string
  pages: ReadonlySet<string>
  from: string
}

/** Where a relative link from `from` (a path in the repository) leads, on the portal or on GitHub. */
const target = (link: string, { repo, tag, pages, from }: Context, image: boolean): string => {
  if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith("#") || link.startsWith("/")) return link
  const [path = "", anchor] = link.split("#")
  const resolved = normalize(join(dirname(from), path))
  const suffix = anchor === undefined ? "" : `#${anchor}`
  if (resolved === "CHANGELOG.md") return `./changelog.md${suffix}`
  const page = /^docs\/([^/]+)\.md$/.exec(resolved)?.[1]
  if (page && pages.has(page)) return `./${page}.md${suffix}`
  return image
    ? `https://raw.githubusercontent.com/${repo}/${tag}/${resolved}`
    : `https://github.com/${repo}/blob/${tag}/${resolved}${suffix}`
}

/**
 * One repository file as a portal page: its `# heading` becomes the frontmatter title, and every
 * relative link points either at a page of the same tool or at the file on GitHub at the same tag.
 * Code is left alone.
 */
export const toPage = (text: string, context: Context): string => {
  const lines = text.split("\n")
  let title = ""
  let fenced = false
  const out: string[] = []
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    if (fenced || /^\s*(```|~~~)/.test(line)) {
      out.push(line)
      continue
    }
    if (!title && /^# /.test(line)) {
      title = line.slice(2).trim()
      continue
    }
    out.push(
      line.replace(
        /(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
        (_, bang: string, label: string, link, rest) =>
          `${bang}[${label}](${target(link, context, bang === "!")}${rest})`,
      ),
    )
  }
  const body = out.join("\n").replace(/^\s+/, "")
  return `---\ntitle: ${JSON.stringify(title)}\n---\n\n${body}`
}

const run = (command: string, args: string[], cwd?: string) =>
  execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  })

const sync = (tool: Tool, root: string, ref?: string) => {
  const tag = ref ?? latestTag(run("git", ["ls-remote", "--tags", `https://github.com/${tool.repo}.git`]))
  if (!tag) throw new Error(`${tool.repo}: no vX.Y.Z tag`)
  const checkout = mkdtempSync(join(tmpdir(), `cli-docs-${tool.name}-`))
  try {
    run("git", [
      "-c",
      "advice.detachedHead=false",
      "clone",
      "-q",
      "--depth",
      "1",
      "--branch",
      tag,
      "--filter=blob:none",
      "--sparse",
      `https://github.com/${tool.repo}.git`,
      checkout,
    ])
    run("git", ["sparse-checkout", "set", "docs"], checkout)
    const problems = structureProblems(checkout)
    if (problems.length > 0) throw new Error(`${tool.repo} ${tag}:\n${problems.join("\n")}`)

    const docs = join(checkout, "docs")
    const files = readdirSync(docs).filter((name) => name.endsWith(".md") && name !== "README.md")
    const pages = new Set(files.map((name) => name.slice(0, -3)))
    const destination = join(root, "content/docs", tool.name)
    rmSync(destination, { recursive: true, force: true })
    mkdirSync(destination, { recursive: true })

    for (const file of files) {
      const page = toPage(readFileSync(join(docs, file), "utf8"), {
        repo: tool.repo,
        tag,
        pages,
        from: `docs/${file}`,
      })
      writeFileSync(join(destination, file), page)
    }
    if (existsSync(join(checkout, "CHANGELOG.md"))) {
      const changelog = toPage(readFileSync(join(checkout, "CHANGELOG.md"), "utf8"), {
        repo: tool.repo,
        tag,
        pages,
        from: "CHANGELOG.md",
      })
      writeFileSync(join(destination, "changelog.md"), changelog)
    }
    // root: each tool is a tab of its own in the sidebar, not a folder under the others.
    const meta = JSON.parse(readFileSync(join(docs, "meta.json"), "utf8")) as Record<string, unknown>
    writeFileSync(join(destination, "meta.json"), `${JSON.stringify({ ...meta, root: true }, null, 2)}\n`)
    if (existsSync(join(docs, "design")))
      cpSync(join(docs, "design"), join(root, "public", tool.name), {
        recursive: true,
      })
    console.log(`${tool.name}: ${files.length} pages from ${tool.repo} ${tag}`)
    captureUpstream(root, tool)
    const untranslated = localizeTool(root, tool)
    if (untranslated.length) throw new Error(`Documentation localization failed:\n${untranslated.join("\n")}`)
  } finally {
    rmSync(checkout, { recursive: true, force: true })
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as Tool[]
  const { values } = parseArgs({ options: { ref: { type: "string" } } })
  for (const tool of tools) sync(tool, root, values.ref)
}
