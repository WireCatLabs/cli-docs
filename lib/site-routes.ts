export const homePath = (lang: string) => (lang === "en" ? "/" : `/${lang}`)
export const localeFromPath = (pathname: string) => /^\/(en|ru|es)(?=\/|$)/.exec(pathname)?.[1] ?? "en"

export function localizedPath(pathname: string, lang: string) {
  const suffix = pathname.replace(/^\/(en|ru|es)(?=\/|$)/, "")
  return !suffix || suffix === "/" ? homePath(lang) : `/${lang}${suffix}`
}
