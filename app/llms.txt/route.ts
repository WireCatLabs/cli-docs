import type { Node } from "fumadocs-core/page-tree"
import { isSecondaryPage } from "@/lib/agent-docs"
import { i18n } from "@/lib/i18n"
import { documentationDescription } from "@/lib/seo"
import { appName, getPageMarkdownUrl, siteUrl, tools } from "@/lib/shared"
import { source } from "@/lib/source"
import { wordsFor } from "@/lib/words"

export const revalidate = false

const urlsOf = (nodes: readonly Node[]): string[] =>
  nodes.flatMap((node) => {
    if (node.type === "page") return [node.url]
    if (node.type === "folder") return [...(node.index ? [node.index.url] : []), ...urlsOf(node.children)]
    return []
  })

type Page = ReturnType<typeof source.getPages>[number]

// Absolute links, because agents copy this file out of its origin; https://llmstxt.org
const markdownLink = (page: Page) => `${siteUrl}${getPageMarkdownUrl(page).url}`

const entry = (page: Page) => {
  const note = documentationDescription(i18n.defaultLanguage, page.slugs, page.data.description)
  return `- [${page.data.title}](${markdownLink(page)}): ${note.replace(/\s+/g, " ").trim()}`
}

const isSecondary = (page: Page) => isSecondaryPage(page.slugs)

// English index in sidebar order; localized pages follow the same paths under /ru or /es.
export function GET() {
  const pages = new Map(source.getPages(i18n.defaultLanguage).map((page) => [page.url, page]))
  // Sidebar order first, then pages the sidebar leaves out, so a page missing from meta.json still gets listed.
  const inTree = urlsOf(source.getPageTree(i18n.defaultLanguage).children).flatMap((url) => {
    const page = pages.get(url)
    return page ? [page] : []
  })
  const ordered = [...inTree, ...[...pages.values()].filter((page) => !inTree.includes(page))]
  const section = (title: string, list: Page[], intro?: string) =>
    [`## ${title}`, "", ...(intro ? [intro, ""] : []), ...list.filter((page) => !isSecondary(page)).map(entry)].join(
      "\n",
    )
  const toolPages = (name: string) => ordered.filter((page) => page.slugs[0] === name)
  const general = ordered.filter((page) => !tools.some((tool) => tool.name === page.slugs[0]))
  const setup = tools.map(
    (tool) =>
      `To install \`${tool.name}\` for the user, carry out the request they would give you:\n\n\`\`\`text\n${wordsFor(i18n.defaultLanguage).onboarding.prompt(tool.name, tool.package)}\n\`\`\``,
  )
  const localized = i18n.languages
    .filter((lang) => lang !== i18n.defaultLanguage)
    .map((lang) => `\`${siteUrl}/llms.mdx/docs/${lang}/content.md\``)
  const text = [
    `# ${appName}`,
    "",
    "> Command line tools that connect an AI agent (Claude Code, Codex, Cursor, Gemini CLI) to the user's Telegram and MAX accounts, notes and files. Every link below is the page as Markdown.",
    "",
    `${siteUrl}/llms-full.txt is every English page in one file, without changelogs and the per-group command pages. The same pages exist in Russian and Spanish: insert the language after /llms.mdx/docs/, for example ${localized.join(" or ")}.`,
    "",
    ...setup.flatMap((block) => [block, ""]),
    section("Getting started", general),
    "",
    ...tools.flatMap((tool) => [section(tool.name, toolPages(tool.name), tool.summary.en), ""]),
    "## Optional",
    "",
    ...ordered
      .filter(isSecondary)
      .map(
        (page) => `- [${page.slugs.length > 1 ? `${page.slugs[0]}: ` : ""}${page.data.title}](${markdownLink(page)})`,
      ),
    "",
  ].join("\n")
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
