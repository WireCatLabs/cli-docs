import { createGetUrl } from "fumadocs-core/source"
import tools from "@/tools.json"

export type Tool = (typeof tools)[number]
export { tools }

export const appName = "WireCat"
export const tagline = "AI messaging with CLI tools for agents"
export const siteDescription =
  "Connect Claude Code, Codex or another agent to your Telegram and MAX: find who owes what, set reminders and reply."
export const docsRoute = "/docs"
export const docsContentRoute = "/llms.mdx/docs"
export const repository = "https://github.com/leemour/cli-docs"
export const siteUrl = "https://wirecat.dev"

export const toolOf = (slugs: readonly string[]): Tool | undefined => tools.find((tool) => tool.name === slugs[0])

const getContentUrl = createGetUrl(docsContentRoute)

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "content.md"]
  return { segments, url: getContentUrl(segments) }
}
