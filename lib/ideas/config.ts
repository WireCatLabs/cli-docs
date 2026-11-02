import siteConfig from "@/site.config.json"
import tools from "@/tools.json"

/**
 * The page ships only once the API exists: until `ideas.apiUrl` is set, production builds export a 404 for every
 * ideas route and leave the footer link out. `next dev` shows the screens with sample data.
 */
export const ideasLive = !!siteConfig.ideas.apiUrl
export const ideasEnabled = ideasLive || process.env.NODE_ENV === "development"
export const ideasSample = !ideasLive

export const ideasPath = (lang: string, ...rest: string[]) => [`/${lang}/ideas`, ...rest].join("/")
export const ideaPath = (lang: string, id: string) => `${ideasPath(lang, "idea")}?id=${encodeURIComponent(id)}`

const repos: Record<string, string> = Object.fromEntries(tools.map((tool) => [tool.name, tool.repo]))

/** Where a bug in this tool goes; desktop and "everything else" have no single repository. */
export const issuesUrl = (tool?: string) =>
  tool && repos[tool] ? `https://github.com/${repos[tool]}/issues` : siteConfig.github
