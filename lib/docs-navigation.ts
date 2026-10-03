/** Keep the reader in the same section when both messengers have it. */
export function messengerHref(pathname: string, lang: string, tool: string, pages: readonly string[]): string {
  const prefix = `/${lang}/docs/`
  const slugs = pathname.startsWith(prefix) ? pathname.slice(prefix.length).split("/").filter(Boolean) : []
  const section = slugs[0] === "tg" || slugs[0] === "max" ? slugs.slice(1) : []
  const target = [tool, ...section].join("/")
  return `/${lang}/docs/${pages.includes(target) ? target : tool}`
}

/** Shared onboarding pages belong to Getting started, not to a messenger. */
export function isGettingStarted(pathname: string): boolean {
  return /^\/(en|ru|es)\/docs(?:\/(?:installation|agents|mcp))?\/?$/.test(pathname)
}
