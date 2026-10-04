import { fromMarkdown } from "mdast-util-from-markdown"

type Node = {
  type: string
  url?: string
  children?: Node[]
  position?: { start: { offset?: number }; end: { offset?: number } }
}

function destinationStart(raw: string, definition: boolean) {
  if (definition) return /^\[[^\]]+\]:\s*/.exec(raw)?.[0].length
  let depth = 0
  for (let i = raw.startsWith("!") ? 1 : 0; i < raw.length; i++) {
    if (raw[i] === "\\") {
      i++
      continue
    }
    if (raw[i] === "[") depth++
    if (raw[i] === "]" && --depth === 0) {
      const match = /^\]\(\s*/.exec(raw.slice(i))
      return match ? match[0].length + i : undefined
    }
  }
}

/** Edit only parsed link destinations; prose, code fences, tables and executable examples stay byte-for-byte. */
export function rewriteMarkdownLinks(text: string, resolve: (url: string) => string): string {
  const edits: { start: number; end: number; value: string }[] = []
  const visit = (node: Node) => {
    if (node.url !== undefined && ["link", "image", "definition"].includes(node.type)) {
      const replacement = resolve(node.url)
      const start = node.position?.start.offset
      const end = node.position?.end.offset
      if (replacement !== node.url && start !== undefined && end !== undefined) {
        const raw = text.slice(start, end)
        if (raw.startsWith("<") && raw.endsWith(">")) {
          edits.push({ start, end, value: `[${raw.slice(1, -1)}](${replacement})` })
          return
        }
        let at = destinationStart(raw, node.type === "definition")
        if (at === undefined) throw new Error(`Cannot locate Markdown destination: ${node.url}`)
        const angle = raw[at] === "<"
        if (angle) at++
        let stop = at
        let depth = 0
        for (; stop < raw.length; stop++) {
          if (raw[stop] === "\\") {
            stop++
            continue
          }
          if (angle ? raw[stop] === ">" : /\s/.test(raw[stop]) || (raw[stop] === ")" && depth === 0)) break
          if (!angle && raw[stop] === "(") depth++
          if (!angle && raw[stop] === ")") depth--
        }
        edits.push({ start: start + at, end: start + stop, value: replacement })
      }
    }
    for (const child of node.children ?? []) visit(child)
  }
  visit(fromMarkdown(text) as Node)
  for (const edit of edits.toSorted((a, b) => b.start - a.start))
    text = text.slice(0, edit.start) + edit.value + text.slice(edit.end)
  return text
}

export function resolveDocumentationLink(
  href: string,
  pageUrl: string,
  siteUrl: string,
  markdownUrlFor: (pathname: string) => string | undefined,
): string {
  if (href.startsWith("#")) return href
  const target = new URL(href, new URL(pageUrl, siteUrl))
  if (target.origin !== new URL(siteUrl).origin) return href
  const pathname = decodeURIComponent(target.pathname)
    .replace(/\.(?:md|mdx)$/, "")
    .replace(/\/index$/, "")
  const markdown = markdownUrlFor(pathname)
  return markdown ? `${markdown}${target.search}${target.hash}` : href
}
