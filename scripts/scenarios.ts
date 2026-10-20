import { existsSync, readdirSync, readFileSync } from "node:fs"
import { basename, join } from "node:path"
import { parseDocument } from "yaml"

export type Scenario = {
  name: string
  title: string
  goal: string
  steps: { run: string; why: string }[]
  look: string[]
  body: string
}

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const line = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0

/** The same contract the tools' `guide` command enforces (cli-core `parseScenario`), plus the body it ignores. */
export function parseScenario(file: string, content: string): Scenario {
  const name = basename(file, ".md")
  const fail = (problem: string) => new Error(`scenarios/${basename(file)}: ${problem}`)
  if (!NAME.test(name)) throw fail("the file name is the scenario's name: lower case words and dashes")
  const match = FRONT_MATTER.exec(content)
  if (!match) throw fail("needs front matter between --- lines")
  const yaml = parseDocument(match[1] ?? "", { uniqueKeys: true })
  if (yaml.errors.length > 0) throw fail("front matter is not valid YAML")
  const data = yaml.toJS({ maxAliasCount: 0 }) as Record<string, unknown>
  const steps = Array.isArray(data?.steps) ? (data.steps as Record<string, unknown>[]) : []
  const look = typeof data?.look === "string" ? [data.look] : data?.look
  if (!line(data?.title) || !line(data?.goal)) throw fail("title and goal are lines of text")
  if (steps.length === 0 || !steps.every((step) => line(step?.run) && line(step?.why)))
    throw fail("steps is a list of { run, why }")
  if (!Array.isArray(look) || look.length === 0 || !look.every(line)) throw fail("look is a line or a list of lines")
  return {
    name,
    title: data.title.trim(),
    goal: data.goal.trim(),
    steps: steps.map((step) => ({ run: String(step.run).trim(), why: String(step.why).trim() })),
    look: (look as string[]).map((item) => item.trim()),
    body: content.slice(match[0].length).trim(),
  }
}

export function readScenarios(directory: string): Scenario[] {
  if (!existsSync(directory)) return []
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .sort()
    .map((file) => parseScenario(file, readFileSync(join(directory, file), "utf8")))
}

/** Markdown in these pages is not MDX, so a bare `<` would start raw HTML and the text would vanish. */
const prose = (text: string) => text.replace(/</g, "&lt;")
const heading = (title: string) => prose(title.charAt(0).toUpperCase() + title.slice(1))

/** memo holds the scenarios that reach across tools; one of them belongs on a tool's page when a step runs it. */
export const crossToolScenarios = (cli: string, memo: Scenario[]) =>
  memo.filter((scenario) => scenario.steps.some((step) => step.run.split(/\s+/)[0] === cli))

/**
 * One portal page from a tool's `scenarios/*.md`, in the same order and words as `<tool> guide`. Commands are
 * fenced so docs:quality validates them against the pinned release and translations cannot change them.
 */
export function scenarioPage(
  tool: { name: string; displayName?: string; profile?: boolean },
  scenarios: Scenario[],
  crossTool: Scenario[] = [],
): string {
  const cli = tool.name
  const lines = [
    "# Step-by-step scenarios",
    "",
    `Each scenario is a common task in order: the commands to run, why each one runs and what to look at in the answer. The same scenarios are in the terminal: \`${cli} guide\` lists them and \`${cli} guide <name>\` prints one.`,
    "",
  ]
  if (
    tool.profile !== false &&
    scenarios.some((scenario) => scenario.steps.some((step) => step.run.startsWith(`${cli} `)))
  )
    lines.push(
      `Commands that use an account start with your profile, the name you gave the account at login: \`${cli} <profile> …\`.`,
      "",
    )
  for (const scenario of scenarios) {
    lines.push(`<a id="${scenario.name}" />`, "", `## ${heading(scenario.title)}`, "", prose(scenario.goal), "")
    scenario.steps.forEach((step, index) => {
      const marker = `${index + 1}. `
      const indent = " ".repeat(marker.length)
      lines.push(`${marker}\`\`\`sh`, `${indent}${step.run}`, `${indent}\`\`\``, "", `${indent}${prose(step.why)}`, "")
    })
    lines.push("What to look at:", "", ...scenario.look.map((item) => `- ${prose(item)}`), "")
    if (scenario.body) lines.push(scenario.body, "")
    lines.push(`In the terminal: \`${cli} guide ${scenario.name}\``, "")
  }
  if (crossTool.length > 0) {
    lines.push("## Works with other tools", "", `These Memo scenarios also use \`${cli}\`:`, "")
    for (const scenario of crossTool)
      lines.push(
        `- [${heading(scenario.title)}](https://wirecat.dev/en/docs/memo/scenarios#${scenario.name}): \`memo guide ${scenario.name}\``,
      )
    lines.push("")
  }
  return lines.join("\n")
}
