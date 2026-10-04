import { fromMarkdown } from "mdast-util-from-markdown"
import { type DocTermId, docTerm } from "./doc-terms"
import { wordsFor } from "./words"

/** Expand authored hints and prerequisite prompts for agents; never replace lookalikes inside code examples. */
export function expandDocTerms(markdown: string, lang: string): string {
  const replacements: { start: number; end: number; text: string }[] = []
  type Node = ReturnType<typeof fromMarkdown>["children"][number]
  const visit = (node: Node) => {
    if (node.type === "html" && node.position) {
      const pattern = /<(DocTerm|NodeSetupPrompt)\b([^>]*)\/>/g
      for (const match of node.value.matchAll(pattern)) {
        const props = Object.fromEntries([...match[2].matchAll(/(\w+)="([^"]*)"/g)].map((attr) => [attr[1], attr[2]]))
        const language = props.lang ?? lang
        const entry = match[1] === "DocTerm" ? docTerm(props.term as DocTermId, language) : undefined
        const text = entry
          ? `${props.label ?? entry.title} (${entry.description})`
          : `\`\`\`text\n${wordsFor(language).onboarding.nodePrompt}\n\`\`\``
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
