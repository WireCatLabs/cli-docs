import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { fromMarkdown } from "mdast-util-from-markdown"

type Lang = "en" | "ru" | "es"
type Node = {
  type: string
  depth?: number
  ordered?: boolean | null
  url?: string
  value?: string
  children?: Node[]
  position?: { start: { line: number; offset?: number } }
}
export type Finding = { file: string; line: number; rule: "opening" | "contents" | "style"; message: string }
type Rules = { contentsLabels: Record<Lang, string>; words: Partial<Record<Lang, { pattern: string; fix: string }[]>> }

const rules = JSON.parse(
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), "docs-opening.json"), "utf8"),
) as Rules
// Generated command references and release history have no reader opening to check.
const exempt = /(?:^|\/)(?:commands(?:-(?:personal|bot|admin))?|changelog|roadmap)(?:\.[a-z]{2})?\.mdx?$/
const page = /^content\/docs\/.+\.mdx?$/

export const langOf = (file: string): Lang => (/\.ru\.mdx?$/.test(file) ? "ru" : /\.es\.mdx?$/.test(file) ? "es" : "en")

const blank = (text: string) => text.replace(/[^\n]/g, " ")
const parse = (file: string, markdown: string): Node => {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, blank)
  return fromMarkdown(file.endsWith(".mdx") ? body.replace(/^(?:import|export) .*$/gm, blank) : body) as Node
}
const text = (node: Node): string => node.value ?? node.children?.map(text).join("") ?? ""
const lineOf = (node: Node) => node.position?.start.line ?? 1
const links = (node: Node): Node[] => (node.type === "link" ? [node] : (node.children?.flatMap(links) ?? []))
const isLabel = (node: Node, label: string) =>
  node.type === "paragraph" && node.children?.[0]?.type === "strong" && text(node.children[0]).trim() === label

export function openingFindings(file: string, markdown: string): Finding[] {
  if (exempt.test(file)) return []
  const label = rules.contentsLabels[langOf(file)]
  const blocks = parse(file, markdown).children ?? []
  const firstSection = blocks.findIndex((node) => node.type === "heading" && node.depth === 2)
  const opening = (firstSection < 0 ? blocks : blocks.slice(0, firstSection)).filter(
    (node) => !(node.type === "heading" && node.depth === 1) && node.type !== "html",
  )
  const findings: Finding[] = []
  const add = (rule: Finding["rule"], line: number, message: string) => findings.push({ file, line, rule, message })
  const first = opening[0]
  if (!first)
    add(
      "opening",
      firstSection < 0 ? 1 : lineOf(blocks[firstSection]),
      "open with a paragraph that says what the page is for, before the first section",
    )
  else if (first.type === "code")
    add("opening", lineOf(first), "the page opens with a command; open with a paragraph that says what the page is for")
  else if (isLabel(first, label))
    add(
      "opening",
      lineOf(first),
      "the page opens with its contents; put a paragraph that says what the page is for above them",
    )
  else if (first.type !== "paragraph")
    add(
      "opening",
      lineOf(first),
      `the page opens with a ${first.type}; open with a paragraph that says what the page is for`,
    )

  const sections = blocks.filter((node) => node.type === "heading" && node.depth === 2).length
  if (sections <= 3) return findings
  const index = opening.findIndex((node) => isLabel(node, label))
  const contentsShape = `a "**${label}**" line, then a numbered list with one "1. [Section](#anchor)" per line`
  if (index < 0) {
    add(
      "contents",
      lineOf(blocks[firstSection]),
      `${sections} sections need contents before the first "##": ${contentsShape}`,
    )
    return findings
  }
  const labelNode = opening[index]
  const list = opening[index + 1]
  if (links(labelNode).length || (list?.type === "paragraph" && links(list).length))
    add("contents", lineOf(labelNode), `the contents are an inline list; use ${contentsShape}`)
  else if (list?.type !== "list" || !list.ordered)
    add("contents", lineOf(labelNode), `the contents label needs a numbered list under it: ${contentsShape}`)
  else
    for (const item of list.children ?? []) {
      const found = links(item)
      if (found.length !== 1 || !found[0].url?.startsWith("#"))
        add("contents", lineOf(item), `each contents item links one section: ${contentsShape}`)
    }
  return findings
}

export function styleFindings(file: string, markdown: string): Finding[] {
  if (exempt.test(file)) return []
  const words = (rules.words[langOf(file)] ?? []).map(({ pattern, fix }) => ({
    regex: new RegExp(`(?<![\\p{L}\\p{N}])${pattern}(?![\\p{L}\\p{N}])`, "giu"),
    fix,
  }))
  const findings: (Finding & { offset: number })[] = []
  const walk = (node: Node) => {
    if (node.type === "text" && node.value)
      for (const { regex, fix } of words)
        for (const match of node.value.matchAll(regex))
          findings.push({
            file,
            line: lineOf(node) + (node.value.slice(0, match.index).match(/\n/g)?.length ?? 0),
            rule: "style",
            message: `«${match[0].replace(/\s+/g, " ")}»: ${fix}`,
            offset: (node.position?.start.offset ?? 0) + (match.index ?? 0),
          })
    node.children?.forEach(walk)
  }
  // Generated tables take their wording from the source schema, not from this page.
  const prose = markdown.replace(/\{\/\* tables:start[\s\S]*?\{\/\* tables:end \*\/\}/g, blank)
  if (words.length) walk(parse(file, prose))
  return findings.sort((a, b) => a.offset - b.offset).map(({ offset: _, ...finding }) => finding)
}

export const pageFindings = (file: string, markdown: string) => [
  ...openingFindings(file, markdown),
  ...styleFindings(file, markdown),
]

const defaultBase = `origin/${process.env.GITHUB_BASE_REF || "main"}`

export function changedPages(root: string, base = defaultBase): string[] | null {
  const git = (...args: string[]) => execFileSync("git", ["-C", root, ...args], { encoding: "utf8", stdio: "pipe" })
  let mergeBase: string
  try {
    mergeBase = git("merge-base", base, "HEAD").trim()
  } catch {
    return null
  }
  const files = [
    ...git("diff", "--name-only", "--diff-filter=d", mergeBase, "--", "content/docs").split("\n"),
    ...git("ls-files", "--others", "--exclude-standard", "--", "content/docs").split("\n"),
  ]
  return [...new Set(files)].filter((file) => page.test(file) && existsSync(join(root, file))).sort()
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const named = process.argv.slice(2)
  const files = named.length ? named : changedPages(root)
  if (!files) console.log(`Page openings: no base branch ${defaultBase} to compare with; skipped`)
  else {
    const findings = files.flatMap((file) => pageFindings(file, readFileSync(join(root, file), "utf8")))
    for (const finding of findings)
      console.error(`${finding.file}:${finding.line}: ${finding.rule}: ${finding.message}`)
    if (findings.length) {
      console.error(
        `${findings.length} problem(s) in new or changed pages; see docs/AUTHORING.md, "Mandatory opening order".`,
      )
      process.exitCode = 1
    } else console.log(`Page openings and wording: ${files.length} new or changed page(s) pass`)
  }
}
