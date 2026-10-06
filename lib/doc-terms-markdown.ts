import { fromMarkdown } from "mdast-util-from-markdown"
import { type DocTermId, docTerm } from "./doc-terms"
import { agentPromptMarkdown } from "./installation-markdown"
import { wordsFor } from "./words"

/** Expand authored hints and prerequisite prompts for agents; never replace lookalikes inside code examples. */
export function expandDocTerms(markdown: string, lang: string): string {
  const replacements: { start: number; end: number; text: string }[] = []
  type Node = ReturnType<typeof fromMarkdown>["children"][number]
  const visit = (node: Node) => {
    if ((node.type === "html" || node.type === "text") && node.position) {
      const pattern =
        /<(\/?)(DocTerm|NodeSetupPrompt|AgentInstallPrompt|InstallationMessengerTabs|InstallationOsTabs|Screenshot|Tabs|Tab|Steps|Step|Accordions|Accordion)\b([^>]*)>/g
      const authored = markdown.slice(node.position.start.offset, node.position.end.offset)
      for (const match of authored.matchAll(pattern)) {
        const props = Object.fromEntries([...match[3].matchAll(/(\w+)="([^"]*)"/g)].map((attr) => [attr[1], attr[2]]))
        const language = props.lang ?? lang
        let text = ""
        if (!match[1]) {
          if (match[2] === "DocTerm") {
            const entry = docTerm(props.term as DocTermId, language)
            text = `${props.label ?? entry.title} (${entry.description})`
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
