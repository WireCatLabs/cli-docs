import type { Node } from "fumadocs-core/page-tree"
import { i18n } from "@/lib/i18n"
import { getPageMarkdownUrl, tools } from "@/lib/shared"
import { source } from "@/lib/source"

export const revalidate = false

const urlsOf = (nodes: readonly Node[]): string[] =>
  nodes.flatMap((node) => {
    if (node.type === "page") return [node.url]
    if (node.type === "folder") return [...(node.index ? [node.index.url] : []), ...urlsOf(node.children)]
    return []
  })

// The default language only, in sidebar order: every page is built once per interface language,
// and the other copies hold the same text.
export function GET() {
  const pages = new Map(source.getPages(i18n.defaultLanguage).map((page) => [page.url, page]))
  const ordered = urlsOf(source.getPageTree(i18n.defaultLanguage).children)
  const sections = tools.map((tool) => {
    const lines = ordered
      .map((url) => pages.get(url))
      .filter((page) => page?.slugs[0] === tool.name)
      .map((page) => (page ? `- [${page.data.title}](${getPageMarkdownUrl(page).url})` : ""))
    return [`## ${tool.name}`, "", tool.summary.en, "", ...lines].join("\n")
  })
  const text = [
    "# CLI tools",
    "",
    "> Documentation of command line tools built for people and AI agents. Every link is the page as Markdown;",
    "> /llms-full.txt is every page in one file.",
    "",
    ...sections.flatMap((section) => [section, ""]),
  ].join("\n")
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
