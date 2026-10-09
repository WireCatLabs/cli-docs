import { createGetUrl } from "fumadocs-core/source"
import siteConfig from "@/site.config.json"
import tools from "@/tools.json"
import { i18n } from "./i18n"

export type Tool = (typeof tools)[number] & { guideRefs?: Record<string, string> }
export { tools }

export const appName = siteConfig.name
export const tagline = "Messaging tools for your AI agent"
export const siteDescription =
  "Connect your AI agent, for example Claude Code, Codex, Cursor or Gemini CLI, to Telegram and MAX. Find what matters, keep track of commitments and reply with the full context."
export const docsRoute = "/docs"
export const docsContentRoute = "/llms.mdx/docs"
export const repository = siteConfig.repository
export const siteUrl = siteConfig.url

export const toolOf = (slugs: readonly string[]): Tool | undefined => tools.find((tool) => tool.name === slugs[0])

const getContentUrl = createGetUrl(docsContentRoute)

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const locale = page.locale && page.locale !== i18n.defaultLanguage ? [page.locale] : []
  const segments = [...locale, ...page.slugs, "content.md"]
  return { segments, url: getContentUrl(segments) }
}
