import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { CommandInfo, OptionInfo } from "@leemour/cli-core/commands"
import { fromMarkdown } from "mdast-util-from-markdown"
import { parse, quote } from "shell-quote"
import { demoScenarioIds } from "../lib/demo-scenarios.ts"

export type Program = { cli: string; commands: CommandInfo[]; globalOptions: OptionInfo[] }
export type Example = { text: string; line: number; executable: boolean }
export type Finding = {
  file: string
  line: number
  command: string
  reason: string
  kind: "invalid" | "unsupported" | "syntax"
}
export function commandSegments(text: string): string[] {
  try {
    const entries = parse(
      text
        .replace(/^\s*\$\s+/, "")
        .replace(/<([^<>\n]+)>/g, (_, value: string) => `PLACEHOLDER_${value.replace(/\s/g, "_")}`),
      (key) => `$${key}`,
    )
    const result: string[] = []
    let segment: string[] = []
    for (const entry of entries) {
      if (typeof entry !== "string" && "op" in entry && ["&&", "||", ";", "|", "|&"].includes(entry.op)) {
        result.push(segment.join(" "))
        segment = []
      } else if (typeof entry === "string") segment.push(quote([entry]))
      else if ("comment" in entry) break
      else segment.push(entry.op === "glob" ? entry.pattern : entry.op)
    }
    result.push(segment.join(" "))
    return result
  } catch {
    return [text]
  }
}
type MarkdownNode = {
  type: string
  lang?: string | null
  value?: string
  children?: MarkdownNode[]
  position?: { start: { line: number } }
}
export const flatten = (commands: readonly CommandInfo[]): CommandInfo[] =>
  commands.flatMap((command) => [command, ...flatten(command.commands)])
const optionNames = (option: OptionInfo) => option.flags.match(/--[\w-]+|-[a-zA-Z]\b/g) ?? []

export function examples(markdown: string): Example[] {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, (text) => text.replace(/[^\n]/g, " "))
  const result: Example[] = []
  const walk = (node: MarkdownNode) => {
    if (
      node.type === "code" &&
      /^(sh|bash|zsh|shell|powershell|ps1|console|terminal)$/.test("lang" in node ? String(node.lang) : "")
    ) {
      const value = "value" in node ? String(node.value) : ""
      const lines = value.split("\n")
      for (let i = 0; i < lines.length; i++) {
        let text = lines[i]
        const start = i
        while (/[\\`]\s*$/.test(text) && i < lines.length - 1) text = text.replace(/[\\`]\s*$/, " ") + lines[++i].trim()
        result.push({ text, line: (node.position?.start.line ?? 0) + start + 1, executable: true })
      }
    } else if (node.type === "inlineCode" && "value" in node)
      result.push({ text: String(node.value), line: node.position?.start.line ?? 1, executable: false })
    node.children?.forEach(walk)
  }
  walk(fromMarkdown(body))
  return result
}

export function validateInvocation(
  text: string,
  program: Program,
  executable: boolean,
): { reason: string; kind: Finding["kind"] } | null {
  if (/\[options\]|\[profile\]|<command>|<resource>|<verb>|\.\.\.|…/.test(text))
    return { kind: "syntax", reason: "Command syntax illustration" }
  let entries: ReturnType<typeof parse>
  try {
    entries = parse(
      text
        .replace(/^\s*\$\s+/, "")
        .replace(/<([^<>\n]+)>/g, (_, value: string) => `PLACEHOLDER_${value.replace(/\s/g, "_")}`),
      (key) => `$${key}`,
    )
  } catch {
    return { kind: "unsupported", reason: "Cannot tokenize this shell example" }
  }
  const start = entries.indexOf(program.cli)
  if (start < 0 || (start > 0 && typeof entries[start - 1] === "string" && !String(entries[start - 1]).includes("=")))
    return null
  const tokens: string[] = []
  for (const [index, entry] of entries.slice(start + 1).entries()) {
    if (typeof entry !== "string") {
      if ("op" in entry && entry.op === "glob")
        return { kind: "unsupported", reason: "Shell glob needs a reviewed expansion" }
      break
    }
    const next = entries[start + index + 2]
    if (
      /^\d+$/.test(entry) &&
      typeof next !== "string" &&
      next &&
      "op" in next &&
      [">", ">>", ">&", "<"].includes(next.op)
    )
      break
    tokens.push(entry)
  }
  const all = flatten(program.commands)
  const roots = new Set(program.commands.map((command) => command.path[0]))
  const globals = new Map(
    program.globalOptions.flatMap((option) => optionNames(option).map((name) => [name, option] as const)),
  )
  const withoutGlobals: string[] = []
  for (let i = 0; i < tokens.length; i++) {
    const option = globals.get(tokens[i].split("=")[0])
    if (!option) {
      withoutGlobals.push(tokens[i])
      continue
    }
    if (tokens[i] === "--help" || tokens[i] === "-h") return null
    if (option.takesValue && !tokens[i].includes("=") && /<[^>]+>/.test(option.flags)) {
      if (tokens[i + 1] === undefined || tokens[i + 1].startsWith("--"))
        return executable ? { kind: "invalid", reason: `${tokens[i]} requires a value` } : null
      i++
    }
  }
  if (!withoutGlobals.length) return null
  if (withoutGlobals[0] === "--help" || withoutGlobals[0] === "-h") return null
  if (!executable && withoutGlobals.slice(0, 2).join(" ") === "on PATH") return null
  if (!roots.has(withoutGlobals[0]) && roots.has(withoutGlobals[1])) withoutGlobals.shift()
  const command = all
    .filter((item) => item.path.every((word, index) => withoutGlobals[index] === word))
    .sort((a, b) => b.path.length - a.path.length)[0]
  if (!command)
    return {
      kind: withoutGlobals[0].includes("$") ? "unsupported" : "invalid",
      reason: `Unknown command: ${withoutGlobals[0]}`,
    }
  const remaining = withoutGlobals.slice(command.path.length)
  const options = new Map(
    [
      ...program.globalOptions,
      ...all
        .filter(
          (item) =>
            item.path.length < command.path.length && item.path.every((word, index) => command.path[index] === word),
        )
        .flatMap((item) => item.options),
      ...command.options,
    ].flatMap((option) => optionNames(option).map((name) => [name, option] as const)),
  )
  const positional: string[] = []
  let literal = false
  for (let i = 0; i < remaining.length; i++) {
    const token = remaining[i]
    if (token === "--") {
      literal = true
      continue
    }
    if (!literal && /^--|^-[a-zA-Z]/.test(token)) {
      const name = token.split("=")[0]
      if (name === "--help" || name === "-h") return null
      const option = options.get(name)
      if (!option) return { kind: "invalid", reason: `Unknown option ${name} for ${command.path.join(" ")}` }
      if (!option.takesValue && token.includes("=")) return { kind: "invalid", reason: `${name} does not take a value` }
      if (option.takesValue && !token.includes("=")) {
        if (/<[^>]+>/.test(option.flags)) {
          if (remaining[i + 1] === undefined || remaining[i + 1].startsWith("--"))
            return executable ? { kind: "invalid", reason: `${name} requires a value` } : null
          i++
        } else if (remaining[i + 1] !== undefined && !remaining[i + 1].startsWith("-")) i++
      }
    } else positional.push(token)
  }
  if (command.commands.length && positional[0]?.startsWith("PLACEHOLDER_"))
    return { kind: "unsupported", reason: "Subcommand placeholder requires a concrete operation" }
  if (command.commands.length && positional[0]?.includes("|"))
    return { kind: "syntax", reason: "Alternative subcommand syntax" }
  if (command.commands.length && positional.length && !command.arguments.length)
    return { kind: "invalid", reason: `Unknown subcommand ${positional[0]} for ${command.path.join(" ")}` }
  if (!executable) return null
  const minimum = command.arguments.filter((arg) => arg.required).length
  if (positional.length < minimum)
    return { kind: "invalid", reason: `${command.path.join(" ")} needs ${minimum} argument(s)` }
  if (!command.arguments.some((arg) => arg.variadic) && positional.length > command.arguments.length)
    return { kind: "invalid", reason: `Too many arguments for ${command.path.join(" ")}` }
  return null
}

export function referenceCoverage(text: string, program: Program) {
  const headings = [...text.matchAll(/^#{2,6}\s+`([^`]+)`/gm)]
  return flatten(program.commands).map((command) => {
    const path = `${program.cli} ${command.path.join(" ")}`
    const index = headings.findIndex((heading) => heading[1] === path)
    const section = index < 0 ? "" : text.slice(headings[index].index, headings[index + 1]?.index ?? text.length)
    return {
      command: path,
      present: index >= 0,
      missingOptions: command.options.flatMap((option) =>
        optionNames(option).filter((name) => !new RegExp(`(?<![\\w-])${name}(?![\\w-])`).test(section)),
      ),
    }
  })
}

const filesIn = (folder: string): string[] =>
  readdirSync(folder, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? filesIn(join(folder, entry.name))
      : /\.mdx?$/.test(entry.name)
        ? [join(folder, entry.name)]
        : [],
  )
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as { name: string; docsRef: string }[]
  const findings: Finding[] = []
  let checkedExamples = 0
  const references: { tool: string; docsRef: string; commands: ReturnType<typeof referenceCoverage> }[] = []
  for (const tool of tools) {
    const artifact = join(root, ".docs-tooling/contracts", `${tool.name}.json`)
    if (!existsSync(artifact)) throw new Error(`Missing ${tool.name} contract; run pnpm docs:contracts`)
    const contract = JSON.parse(readFileSync(artifact, "utf8")) as { docsRef: string; program: Program }
    if (contract.docsRef !== tool.docsRef) throw new Error(`Stale ${tool.name} contract; run pnpm docs:contracts`)
    references.push({
      tool: tool.name,
      docsRef: tool.docsRef,
      commands: referenceCoverage(
        readFileSync(join(root, "content/docs", tool.name, "commands.md"), "utf8"),
        contract.program,
      ),
    })
    for (const file of filesIn(join(root, "content/docs"))) {
      if (
        file.includes(`/content/docs/${tool.name === "tg" ? "max" : "tg"}/`) ||
        /\/(commands|changelog|roadmap)(?:\.[a-z]{2})?\.md$/.test(file)
      )
        continue
      for (const example of examples(readFileSync(file, "utf8"))) {
        for (const segment of commandSegments(example.text)) {
          if (!new RegExp(`\\b${tool.name}\\b`).test(segment)) continue
          checkedExamples++
          const finding = validateInvocation(segment, contract.program, example.executable)
          if (finding && new RegExp(`\\b${tool.name}\\b`).test(example.text))
            findings.push({
              file: file.slice(root.length + 1),
              line: example.line,
              command: example.text.trim(),
              ...finding,
            })
        }
      }
    }
    for (const lang of ["en", "ru", "es"]) {
      const file = `lib/landing/${lang}.json`
      const source = readFileSync(join(root, file), "utf8")
      const data = JSON.parse(source) as {
        sessions: { id: string; steps: { tool: boolean; html: string }[] }[]
        maxSessions: { id: string; steps: { tool: boolean; html: string }[] }[]
      }
      for (const session of [...data.sessions, ...data.maxSessions].filter((s) =>
        demoScenarioIds.some((id) => id === s.id),
      )) {
        for (const step of session.steps.filter((step) => step.tool)) {
          const encoded = /<code>([\s\S]*?)<\/code>/.exec(step.html)?.[1]
          if (!encoded) throw new Error(`Missing command markup in ${file}: ${session.id}`)
          const command = encoded
            .replace(/<[^>]*>/g, "")
            .replaceAll("&quot;", '"')
            .replaceAll("&amp;", "&")
            .replaceAll("&lt;", "<")
            .replaceAll("&gt;", ">")
          if (!command.startsWith(`${tool.name} `)) continue
          checkedExamples++
          const finding = validateInvocation(command, contract.program, true)
          if (finding)
            findings.push({
              file,
              line: source.slice(0, source.indexOf(JSON.stringify(step.html))).split("\n").length,
              command,
              ...finding,
            })
        }
      }
    }
  }
  const tasks = JSON.parse(readFileSync(join(root, "docs/tasks.json"), "utf8")) as {
    id: string
    pages: string[]
    families: Record<string, string[]>
  }[]
  const taskCoverage = tasks.map((task) => ({
    ...task,
    missingPages: task.pages.filter((page) => !existsSync(join(root, "content/docs", page))),
    missingFamilies: Object.entries(task.families).flatMap(([tool, families]) => {
      const reference = references.find((item) => item.tool === tool)
      const roots = new Set(reference?.commands.map((item) => item.command.split(" ")[1]) ?? [])
      return families.filter((family) => !roots.has(family)).map((family) => `${tool} ${family}`)
    }),
  }))
  const families = references.map((reference) => {
    const roots = [...new Set(reference.commands.map((command) => command.command.split(" ")[1]))]
    const mapped = new Set(tasks.flatMap((task) => task.families[reference.tool] ?? []))
    return { tool: reference.tool, unmapped: roots.filter((family) => !mapped.has(family)) }
  })
  const report = { references, checkedExamples, examples: findings, tasks: taskCoverage, commandFamilies: families }
  mkdirSync(join(root, ".docs-tooling/reports"), { recursive: true })
  writeFileSync(join(root, ".docs-tooling/reports/quality.json"), JSON.stringify(report, null, 2))
  const invalid = findings.filter((finding) => finding.kind === "invalid")
  const gaps = references.flatMap((reference) =>
    reference.commands.filter((command) => !command.present || command.missingOptions.length),
  )
  console.log(
    `${references.reduce((count, item) => count + item.commands.length, 0)} command reference entries; ${gaps.length} reference gaps; ${invalid.length} invalid examples; ${findings.filter((finding) => finding.kind === "unsupported").length} examples need manual review; ${tasks.length} task mappings.`,
  )
  console.log("Full evidence: .docs-tooling/reports/quality.json")
  if (
    process.argv.includes("--strict") &&
    (invalid.length ||
      gaps.length ||
      taskCoverage.some((task) => task.missingPages.length || task.missingFamilies.length))
  )
    process.exitCode = 1
}
