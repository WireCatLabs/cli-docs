import { createGetUrl } from "fumadocs-core/source"
import tools from "@/tools.json"
import { i18n } from "./i18n"

export type Tool = (typeof tools)[number]
export { tools }

export const appName = "WireCat"
export const docsRoute = "/docs"
export const docsContentRoute = "/llms.mdx/docs"
export const repository = "https://github.com/leemour/cli-docs"
export const siteUrl = "https://wirecat.dev"

export const toolOf = (slugs: readonly string[]): Tool | undefined => tools.find((tool) => tool.name === slugs[0])

const getContentUrl = createGetUrl(docsContentRoute)

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const locale = page.locale && page.locale !== i18n.defaultLanguage ? [page.locale] : []
  const segments = [...locale, ...page.slugs, "content.md"]
  return { segments, url: getContentUrl(segments) }
}
