import { fromMarkdown } from "mdast-util-from-markdown"
import { type DocTermId, docTerm } from "./doc-terms"

/** Expand authored term hints for agents; never replace lookalikes inside code examples. */
export function expandDocTerms(markdown: string, lang: string): string {
  const replacements: { start: number; end: number; text: string }[] = []
  type Node = ReturnType<typeof fromMarkdown>["children"][number]
  const visit = (node: Node) => {
    if (node.type === "html" && node.position) {
      const pattern = /<DocTerm\s+([^>]+)\s*\/>/g
      for (const match of node.value.matchAll(pattern)) {
        const props = Object.fromEntries([...match[1].matchAll(/(\w+)="([^"]*)"/g)].map((attr) => [attr[1], attr[2]]))
        const entry = docTerm(props.term as DocTermId, props.lang ?? lang)
        const start = (node.position.start.offset ?? 0) + (match.index ?? 0)
        replacements.push({
          start,
          end: start + match[0].length,
          text: `${props.label ?? entry.title} (${entry.description})`,
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
