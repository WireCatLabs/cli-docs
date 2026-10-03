import { createHash } from "node:crypto"
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import GithubSlugger from "github-slugger"
import { fromMarkdown } from "mdast-util-from-markdown"

type Tool = { name: string; lang: string }
type Correction = {
  tool: string
  slug: string
  reason: string
  replacements: Record<string, { before: string; after: string }[]>
}
const languages = ["en", "ru", "es"]

/** Reviewed release errata are separate from translation and apply to every locale. */
export function correctDocumentation(text: string, replacements: { before: string; after: string }[]): string {
  let result = text
  for (const { before, after } of replacements) {
    if (!before || result.split(before).length !== 2) throw new Error("Documentation correction no longer matches once")
    result = result.replace(before, () => after)
  }
  return result
}

export const fingerprint = (text: string) =>
  createHash("sha256")
    .update(
      text.replace(/(githubusercontent\.com|github\.com)(\/[^/]+\/[^/]+\/(?:blob\/)?)v\d+\.\d+\.\d+/g, "$1$2RELEASE"),
    )
    .digest("hex")

export const contentLanguage = (text: string, lang: string) =>
  text.replace(/^---\r?\n/, `---\ncontentLanguage: ${JSON.stringify(lang)}\n`)

type MarkdownNode = {
  type: string
  value?: string
  url?: string
  depth?: number
  lang?: string | null
  meta?: string | null
  children?: MarkdownNode[]
  position?: { start: { line: number } }
}
const nodes = (text: string) => {
  // Blank the YAML header without moving the body line numbers used for anchor aliases.
  const body = text.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, (header) => header.replace(/[^\n]/g, " "))
  const result: MarkdownNode[] = []
  const visit = (node: MarkdownNode) => {
    result.push(node)
    node.children?.forEach(visit)
  }
  visit(fromMarkdown(body))
  return result
}
const nodeText = (node: MarkdownNode): string => node.value ?? node.children?.map(nodeText).join("") ?? ""
const headings = (text: string) => {
  const slugger = new GithubSlugger()
  return nodes(text)
    .filter((node) => node.type === "heading")
    .map((node) => ({
      index: (node.position?.start.line ?? 1) - 1,
      depth: node.depth,
      id: slugger.slug(nodeText(node)),
    }))
}

/** Keep incoming links to the original headings working after translation. */
export function withOriginalAnchors(original: string, translated: string): string {
  const before = headings(original)
  const after = headings(translated)
  if (before.length !== after.length || before.some((h, i) => h.depth !== after[i].depth))
    throw new Error("Translation changed heading structure")
  const ids = new Set(after.map((h) => h.id))
  const aliases = new Map<number, string>()
  before.forEach((heading, i) => {
    if (ids.has(heading.id)) return
    aliases.set(after[i].index, `<a id="${heading.id}" />\n\n`)
    ids.add(heading.id)
  })
  return translated
    .split("\n")
    .map((line, i) => `${aliases.get(i) ?? ""}${line}`)
    .join("\n")
}

const fencedCode = (text: string) =>
  nodes(text)
    .filter((node) => node.type === "code")
    .map((node) => [node.lang, node.meta, node.value])

export function translationProblems(original: string, translated: string): string[] {
  const problems: string[] = []
  if (JSON.stringify(fencedCode(original)) !== JSON.stringify(fencedCode(translated)))
    problems.push("Code blocks changed")
  try {
    withOriginalAnchors(original, translated)
  } catch {
    problems.push("Heading structure changed")
  }
  const literals = (text: string) =>
    [
      ...new Set(
        nodes(text)
          .filter((node) => node.type === "inlineCode")
          .map((node) => node.value),
      ),
    ].sort()
  if (JSON.stringify(literals(original)) !== JSON.stringify(literals(translated))) problems.push("Inline code changed")
  const links = (text: string) =>
    nodes(text)
      .filter((node) => node.type === "link" || node.type === "image" || node.type === "definition")
      .map((node) => node.url)
      .sort()
  if (JSON.stringify(links(original)) !== JSON.stringify(links(translated))) problems.push("Link destinations changed")
  return problems
}

const groups: Record<string, string[]> = {
  en: ["---Start here---", "---Everyday tasks---", "---Reference---", "---Help and safety---", "---Project---"],
  ru: [
    "---Начните здесь---",
    "---Повседневные задачи---",
    "---Справочник---",
    "---Помощь и безопасность---",
    "---Проект---",
  ],
  es: [
    "---Empieza aquí---",
    "---Tareas cotidianas---",
    "---Referencia---",
    "---Ayuda y seguridad---",
    "---Proyecto---",
  ],
}

/** Sync captures untouched release pages before installing durable portal translations. */
export function captureUpstream(root: string, tool: Tool) {
  const destination = join(root, "content/upstream", tool.name)
  rmSync(destination, { recursive: true, force: true })
  mkdirSync(destination, { recursive: true })
  cpSync(join(root, "content/docs", tool.name), destination, { recursive: true })
}

export function localizeTool(root: string, tool: Tool) {
  const source = join(root, "content/upstream", tool.name)
  const target = join(root, "content/docs", tool.name)
  const translations = join(root, "translations", tool.name)
  const hashes = JSON.parse(readFileSync(join(root, "translations/sources.json"), "utf8")) as Record<string, string>
  const correctionFile = join(root, "scripts/docs-corrections.json")
  const corrections: Correction[] = existsSync(correctionFile) ? JSON.parse(readFileSync(correctionFile, "utf8")) : []
  const corrected = (text: string, slug: string, lang: string) =>
    correctDocumentation(
      text,
      corrections
        .filter((item) => item.tool === tool.name && item.slug === slug)
        .flatMap((item) => item.replacements[lang] ?? []),
    )
  const pages = readdirSync(source).filter((name) => /^[^.]+\.md$/.test(name))
  const problems: string[] = []
  for (const file of pages) {
    const slug = file.slice(0, -3)
    const original = readFileSync(join(source, file), "utf8")
    writeFileSync(join(target, file), contentLanguage(corrected(original, slug, tool.lang), tool.lang))
    for (const lang of languages) {
      const overview = join(root, "translations/overviews", `${tool.name}.${lang}.md`)
      const path = join(translations, `${slug}.${lang}.md`)
      const destination = join(target, lang === "en" ? file : `${slug}.${lang}.md`)
      if (slug === "index" && existsSync(overview)) {
        writeFileSync(destination, contentLanguage(readFileSync(overview, "utf8"), lang))
        continue
      }
      if (lang === tool.lang && !existsSync(path)) {
        writeFileSync(destination, contentLanguage(corrected(original, slug, lang), lang))
        continue
      }
      if (!existsSync(path)) {
        problems.push(`${tool.name}/${slug}.${lang}: missing translation`)
        if (lang !== "en") writeFileSync(destination, contentLanguage(original, tool.lang))
        continue
      }
      if (hashes[`${tool.name}/${slug}.${lang}`] !== fingerprint(original)) {
        problems.push(`${tool.name}/${slug}.${lang}: source changed; translation needs review`)
        if (lang !== "en") writeFileSync(destination, contentLanguage(original, tool.lang))
        continue
      }
      const translated = readFileSync(path, "utf8")
      const errors = translationProblems(original, translated)
      if (errors.length) {
        problems.push(`${tool.name}/${slug}.${lang}: ${errors.join(", ")}`)
        if (lang !== "en") writeFileSync(destination, contentLanguage(original, tool.lang))
        continue
      }
      writeFileSync(
        destination,
        contentLanguage(withOriginalAnchors(original, corrected(translated, slug, lang)), lang),
      )
    }
  }
  const meta = JSON.parse(readFileSync(join(source, "meta.json"), "utf8")) as { pages: string[]; title: string }
  for (const lang of languages) {
    let group = 0
    const localized = {
      ...meta,
      title: tool.name === "tg" ? "Telegram" : "MAX",
      root: true,
      pages: meta.pages.map((page) => (page.startsWith("---") ? groups[lang][group++] : page)),
    }
    writeFileSync(
      join(target, lang === "en" ? "meta.json" : `meta.${lang}.json`),
      `${JSON.stringify(localized, null, 2)}\n`,
    )
  }
  return problems
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as Tool[]
  if (process.argv.includes("--capture")) for (const tool of tools) captureUpstream(root, tool)
  const problems = tools.flatMap((tool) => localizeTool(root, tool))
  for (const problem of problems) console.error(problem)
  if (problems.length) process.exitCode = 1
  else console.log("Translations: complete, source-matched, commands and links preserved")
}
