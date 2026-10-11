import { fromMarkdown } from "mdast-util-from-markdown"
import { architectureDiagramMarkdown } from "./architecture-diagrams"
import { type DocTermId, docTerm } from "./doc-terms"
import { agentPromptMarkdown } from "./installation-markdown"
import { siteUrl } from "./shared"
import { wordsFor } from "./words"

/** Expand authored hints and prerequisite prompts for agents; never replace lookalikes inside code examples. */
export function expandDocTerms(markdown: string, lang: string): string {
  const replacements: { start: number; end: number; text: string }[] = []
  type Node = ReturnType<typeof fromMarkdown>["children"][number]
  const visit = (node: Node) => {
    if ((node.type === "html" || node.type === "text") && node.position) {
      const pattern =
        /<(\/?)(ArchitectureDiagram|DocTerm|NodeSetupPrompt|MeetingBriefDemo|AgentInstallPrompt|InstallationMessengerTabs|InstallationOsTabs|PlatformSetupTabs|SearchPlayground|Screenshot|Tabs|Tab|Steps|Step|Accordions|Accordion|Callout)\b([^>]*)>/g
      const authored = markdown.slice(node.position.start.offset, node.position.end.offset)
      for (const match of authored.matchAll(pattern)) {
        const props = Object.fromEntries([...match[3].matchAll(/(\w+)="([^"]*)"/g)].map((attr) => [attr[1], attr[2]]))
        const language = props.lang ?? lang
        let text = ""
        if (!match[1]) {
          if (match[2] === "ArchitectureDiagram") {
            text = architectureDiagramMarkdown(props.name, language)
          } else if (match[2] === "DocTerm") {
            const entry = docTerm(props.term as DocTermId, language)
            text = `${props.label ?? entry.title} (${entry.description})`
          } else if (match[2] === "MeetingBriefDemo") {
            text = `[${{ en: "Open the interactive demo", ru: "Открыть интерактивное демо", es: "Abrir la demo interactiva" }[language] ?? "Open the interactive demo"}](https://wirecat.dev/${language}/docs/meeting-brief)`
          } else if (match[2] === "SearchPlayground") {
            // Plain text, not a link: link rewriting would turn it back into this Markdown page.
            text = `${{ en: "The interactive playground runs only in a browser:", ru: "Интерактивная песочница работает только в браузере:", es: "El área de pruebas interactiva solo funciona en un navegador:" }[language] ?? "The interactive playground runs only in a browser:"} ${siteUrl}/${language}/docs/search-playground`
          } else if (match[2] === "NodeSetupPrompt") {
            text = `\`\`\`text\n${wordsFor(language).onboarding.nodePrompt}\n\`\`\``
          } else if (match[2] === "AgentInstallPrompt") {
            if (props.tool !== "tg" && props.tool !== "max") throw new Error("Unknown messenger installation prompt")
            text = agentPromptMarkdown(props.tool, language)
          } else if (match[2] === "Screenshot" && props.src) {
            text = `![${(props.alt ?? "").replace(/[[\]]/g, "\\$&")}](${props.src})`
          } else if (match[2] === "Tab" && props.value) {
            text = `**${props.value}**\n`
          } else if (match[2] === "Accordion" && props.title) {
            text = `### ${props.title}\n`
          } else if (match[2] === "Callout" && props.title) {
            text = `**${props.title}**\n`
          }
        }
        const start = (node.position.start.offset ?? 0) + (match.index ?? 0)
        replacements.push({
          start,
          end: start + match[0].length,
          text,
        })
      }
    }
    if ("children" in node)
      node.children.forEach((child) => {
        visit(child as Node)
      })
  }
  fromMarkdown(markdown).children.forEach(visit)
  let result = markdown
  for (const item of replacements.toReversed())
    result = result.slice(0, item.start) + item.text + result.slice(item.end)
  return result
}

const CONTAINER =
  /^( *)<(\/?)(PlatformSetupTabs|InstallationOsTabs|InstallationMessengerTabs|Tabs|Tab|Steps|Step|Accordions|Accordion|Callout)\b[^>]*?(\/?)>\s*$/

/**
 * Processed MDX indents a component's children two spaces per level, and four spaces make a Markdown
 * code block: links inside an info box or a tab were never rewritten and agents read the steps as code.
 */
export function dedentDocComponents(markdown: string): string {
  let depth = 0
  return markdown
    .split("\n")
    .map((line) => {
      const tag = CONTAINER.exec(line)
      if (tag?.[2]) depth = Math.max(0, depth - 1)
      const indent = " ".repeat(depth * 2)
      const out = line.startsWith(indent) ? line.slice(indent.length) : line
      if (tag && !tag[2] && !tag[4]) depth++
      return out
    })
    .join("\n")
}

/**
 * Agents pay per token: aligned table padding doubled the command references, and anchor aliases
 * exist only for old browser URLs. Code fences stay byte-for-byte.
 */
export function compactAgentMarkdown(markdown: string): string {
  const out: string[] = []
  let fence = false
  for (const line of markdown.split("\n")) {
    const fenceLine = /^ *(```|~~~)/.test(line)
    if (fenceLine) fence = !fence
    if (fence || fenceLine) out.push(line)
    else if (/^<a id="[^"]*"\s*(?:\/>|><\/a>)\s*$/.test(line) || (line === "" && out.at(-1) === "")) continue
    else if (/^\|[\s:|-]+\|$/.test(line)) out.push(line.replace(/-{3,}/g, "---"))
    else if (line.startsWith("|")) out.push(line.replace(/ {2,}(?=\|)/g, " "))
    else out.push(line)
  }
  return out.join("\n")
}
