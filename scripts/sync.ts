/**
 * Fills `content/docs/<tool>/` from each tool's repository at its reviewed release tag (or newest tag for unpinned tools): the pages in
 * `docs/`, its `meta.json` sidebar and the changelog. Never `main` — it can describe what is not
 * released yet. Reviewed prose-only guide overrides use fixed commits and do not change the runtime pin.
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
import { structureProblems } from "@wirecat/cli-base/release"
import { captureUpstream, localizeTool, siteOwnedPage } from "./localize.ts"
import { crossToolScenarios, readScenarios, type Scenario, scenarioPage } from "./scenarios.ts"
import { checkoutCommit, checkoutSource, sourceInstallation } from "./source-install.ts"

export type Tool = {
  name: string
  repo: string
  package: string
  lang: string
  docsRef?: string
  guideRefs?: Record<string, string>
  summary: Record<string, string>
  displayName?: string
  distribution?: "source"
  /** `false` when the tool's commands take no leading profile, as its `guide` command is told. */
  profile?: boolean
}

/** A preview uses its requested ref; published prose overrides must be immutable. */
export function reviewedGuideRefs(tool: Tool, previewRef?: string): [string, string][] {
  const entries = Object.entries(previewRef ? {} : (tool.guideRefs ?? {}))
  for (const [slug, ref] of entries)
    if (!/^[a-z][a-z-]*$/.test(slug) || !/^[a-f0-9]{40}$/.test(ref))
      throw new Error(`${tool.repo}: guide overrides require a page slug and immutable commit`)
  return entries
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
/** Keep imported historical package names consistent with the current installation names. */
export const normalizePackageReferences = (text: string): string => {
  const normalized = text.replace(
    /@[a-z0-9-]+(\/|%2[fF])(cli-(?:core|messaging(?:-onnx|-sqlite)?|tasks|memo|meetings|testing)|(?:tg|max|zoom)-cli)(?![\w-])/g,
    "@wirecat$1$2",
  )
  return normalized
    .replace(/(`@wirecat\/[^`]+`) \(\1 [^)]*\)/g, "$1")
    .replace(/^- .*?(?=\n- |\n\n|\n###|(?![\s\S]))/gms, (bullet) => {
      if (!/Uninstall|no new versions|Desinstala|No habrá nuevas versiones|Удалите|новых версий/i.test(bullet))
        return bullet
      const packages = [...bullet.matchAll(/@wirecat\/([a-z-]+)/g)]
      if (packages.length < 2) return bullet
      const pkg = packages[0][1]
      if (/[А-Яа-я]/.test(bullet))
        return `- **Пакет называется \`@wirecat/${pkg}\`, репозиторий находится в WireCatLabs.** Используйте этот пакет для установки и обновления.`
      if (/Desinstala|No habrá/i.test(bullet))
        return `- **El paquete se llama \`@wirecat/${pkg}\` y el repositorio pertenece a WireCatLabs.** Usa este paquete para instalar y actualizar.`
      return `- **The package is \`@wirecat/${pkg}\` and its repository belongs to WireCatLabs.** Use this package for installations and updates.`
    })
}

export const toPage = (text: string, context: Context): string => {
  text = normalizePackageReferences(text)
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
    // Link syntax that starts inside inline code is an example, not a link; a link's label may hold code.
    const code = [...line.matchAll(/`[^`]*`/g)].map((span) => [span.index, span.index + span[0].length])
    out.push(
      line.replace(
        /(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g,
        (whole, bang: string, label: string, link, rest, offset: number) =>
          code.some(([start, end]) => offset > start && offset < end)
            ? whole
            : `${bang}[${label}](${target(link, context, bang === "!")}${rest})`,
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

const sparseClone = (repo: string, tag: string, checkout: string) =>
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
    `https://github.com/${repo}.git`,
    checkout,
  ])

let memoScenarios: Scenario[] | undefined
/** Cross-tool scenarios come from memo at its own pinned release, whichever tool is being synced. */
const pinnedMemoScenarios = (root: string): Scenario[] => {
  if (memoScenarios) return memoScenarios
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as Tool[]
  const memo = tools.find((tool) => tool.name === "memo")
  if (!memo?.docsRef) return []
  const checkout = mkdtempSync(join(tmpdir(), "cli-docs-memo-scenarios-"))
  try {
    sparseClone(memo.repo, memo.docsRef, checkout)
    run("git", ["sparse-checkout", "set", "scenarios"], checkout)
    memoScenarios = readScenarios(join(checkout, "scenarios"))
  } finally {
    rmSync(checkout, { recursive: true, force: true })
  }
  return memoScenarios
}

/** Scenarios join the Guides group after recipes, or close it when the tool has none. */
export const withScenarios = (pages: string[]): string[] => {
  if (pages.includes("scenarios")) return pages
  const after = pages.includes("recipes")
    ? pages.indexOf("recipes") + 1
    : pages.findIndex((page, index) => index > 0 && page.startsWith("---") && pages.indexOf("usage") < index)
  const at = after < 0 ? pages.length : after
  return [...pages.slice(0, at), "scenarios", ...pages.slice(at)]
}

export const syncTool = (tool: Tool, root: string, ref?: string, captureOnly = false) => {
  const tag =
    ref ?? tool.docsRef ?? latestTag(run("git", ["ls-remote", "--tags", `https://github.com/${tool.repo}.git`]))
  if (!tag) throw new Error(`${tool.repo}: no vX.Y.Z tag`)
  const checkout = mkdtempSync(join(tmpdir(), `cli-docs-${tool.name}-`))
  try {
    if (ref && /^[a-f0-9]{40}$/.test(ref)) checkoutCommit(tool.repo, ref, checkout)
    else if (!ref && sourceInstallation(tool)) checkoutSource(tool, checkout)
    else sparseClone(tool.repo, tag, checkout)
    run("git", ["sparse-checkout", "set", "docs", "scenarios"], checkout)
    const problems = structureProblems(checkout)
    if (problems.length > 0) throw new Error(`${tool.repo} ${tag}:\n${problems.join("\n")}`)

    const docs = join(checkout, "docs")
    const allFiles = readdirSync(docs).filter((name) => name.endsWith(".md") && name !== "README.md")
    // Comparisons are written and checked on this site, not taken from the tool's release.
    const files = allFiles.filter((name) => name !== `${siteOwnedPage}.md`)
    const guides = new Map<string, { text: string; ref: string }>()
    let changelogGuide: { text: string; ref: string } | undefined
    for (const [slug, guideRef] of reviewedGuideRefs(tool, ref)) {
      run("git", ["fetch", "--depth", "1", "origin", guideRef], checkout)
      if (slug === "changelog") {
        changelogGuide = { text: run("git", ["show", `${guideRef}:CHANGELOG.md`], checkout), ref: guideRef }
        continue
      }
      guides.set(`${slug}.md`, { text: run("git", ["show", `${guideRef}:docs/${slug}.md`], checkout), ref: guideRef })
      if (!files.includes(`${slug}.md`)) files.push(`${slug}.md`)
    }
    const pages = new Set([...files, `${siteOwnedPage}.md`].map((name) => name.slice(0, -3)))
    const destination = join(root, captureOnly ? "content/upstream" : "content/docs", tool.name)
    rmSync(destination, { recursive: true, force: true })
    mkdirSync(destination, { recursive: true })

    for (const file of files) {
      const guide = guides.get(file)
      const page = toPage(guide?.text ?? readFileSync(join(docs, file), "utf8"), {
        repo: tool.repo,
        tag: guide?.ref ?? tag,
        pages,
        from: `docs/${file}`,
      })
      writeFileSync(join(destination, file), page)
    }
    const meta = JSON.parse(readFileSync(join(docs, "meta.json"), "utf8")) as Record<string, unknown>
    // The release-note gate reads every npm release's changelog, so a sidebar that drops it must not hide it.
    if (
      tool.distribution !== "source" &&
      existsSync(join(checkout, "CHANGELOG.md")) &&
      !(meta.pages as string[]).includes("changelog")
    )
      (meta.pages as string[]).push("---Project---", "changelog")
    if (
      changelogGuide ||
      ((meta.pages as string[]).includes("changelog") && existsSync(join(checkout, "CHANGELOG.md")))
    ) {
      const changelog = toPage(changelogGuide?.text ?? readFileSync(join(checkout, "CHANGELOG.md"), "utf8"), {
        repo: tool.repo,
        tag: changelogGuide?.ref ?? tag,
        pages,
        from: "CHANGELOG.md",
      })
      writeFileSync(join(destination, "changelog.md"), changelog)
    }
    const scenarios = readScenarios(join(checkout, "scenarios"))
    if (scenarios.length > 0) {
      const crossTool = tool.name === "memo" ? [] : crossToolScenarios(tool.name, pinnedMemoScenarios(root))
      const page = toPage(scenarioPage(tool, scenarios, crossTool), {
        repo: tool.repo,
        tag,
        pages,
        from: "scenarios/README.md",
      })
      writeFileSync(join(destination, "scenarios.md"), page)
      meta.pages = withScenarios(meta.pages as string[])
    }
    // root: each tool is a tab of its own in the sidebar, not a folder under the others.
    const sidebar = meta.pages as string[]
    for (const file of guides.keys()) {
      const slug = file.slice(0, -3)
      if (!sidebar.includes(slug))
        sidebar.splice(slug === "roadmap" ? sidebar.length : sidebar.indexOf("search") + 1, 0, slug)
    }
    writeFileSync(join(destination, "meta.json"), `${JSON.stringify({ ...meta, root: true }, null, 2)}\n`)
    if (!captureOnly && existsSync(join(docs, "design")))
      cpSync(join(docs, "design"), join(root, "public", tool.name), {
        recursive: true,
      })
    console.log(`${tool.name}: ${files.length} pages and ${scenarios.length} scenarios from ${tool.repo} ${tag}`)
    if (captureOnly) return
    captureUpstream(root, tool)
    const untranslated = localizeTool(root, tool)
    if (untranslated.length) throw new Error(`Documentation localization failed:\n${untranslated.join("\n")}`)
    if (process.env.WIRECAT_RELEASE_DRAFT_PREVIEW === "1") {
      const labels = {
        en: "**Release draft preview.** These guide changes are being prepared for the next CLI release.",
        ru: "**Предпросмотр релизного черновика.** Изменения этих руководств готовятся к следующему релизу CLI.",
        es: "**Vista previa del borrador.** Estos cambios se preparan para la próxima versión del CLI.",
      }
      for (const slug of ["groups", "rankings", "search", "archive", "usage"])
        if (guides.has(`${slug}.md`))
          for (const [lang, label] of Object.entries(labels)) {
            const path = join(destination, `${slug}${lang === "en" ? "" : `.${lang}`}.md`)
            const text = readFileSync(path, "utf8")
            writeFileSync(path, text.replace(/^(---\n[\s\S]*?\n---\n)/, `$1\n> ${label}\n`))
          }
    }
  } finally {
    rmSync(checkout, { recursive: true, force: true })
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as Tool[]
  const { values } = parseArgs({
    options: { ref: { type: "string" }, tool: { type: "string" }, "capture-only": { type: "boolean", default: false } },
  })
  if (values.tool && !tools.some((tool) => tool.name === values.tool)) throw new Error(`Unknown tool: ${values.tool}`)
  for (const tool of tools.filter((tool) => !values.tool || values.tool === tool.name))
    syncTool(tool, root, values.ref, values["capture-only"])
}
