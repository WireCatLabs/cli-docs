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

const ownParams = ["preview", "sign_in_error", "next", "merged"]
const ideasPage = (lang: string) => new RegExp(`^/${lang}/ideas(?:/[\\w-]+)*(?:\\?[\\w=&-]*)?$`)

/** Only a page of this language's ideas section, in the shape the API accepts as `return_to`. */
export const safeReturnPath = (lang: string, path: string | null | undefined) =>
  path && ideasPage(lang).test(path) ? path : ideasPath(lang)

/** The page to come back to after sign-in: this ideas page and its query, without the page's own markers. */
export function returnPath(lang: string, pathname: string, search: string) {
  const params = new URLSearchParams(search)
  for (const name of ownParams) params.delete(name)
  const query = params.toString()
  return safeReturnPath(lang, query && ideasPage(lang).test(`${pathname}?${query}`) ? `${pathname}?${query}` : pathname)
}
