import type { Metadata } from "next"
import seoCopy from "./seo-copy.json"
import { appName, siteUrl, tools } from "./shared"

export type SiteLocale = keyof typeof seoCopy
export const seoLocales = Object.keys(seoCopy) as SiteLocale[]
export const localeOf = (lang: string): SiteLocale => (lang in seoCopy ? (lang as SiteLocale) : "en")
export const seoWords = (lang: string) => seoCopy[localeOf(lang)]
export const absoluteUrl = (pathname: string) => new URL(pathname, siteUrl).href

export function pageAlternates(lang: string, suffix: string, available = seoLocales) {
  const languages = Object.fromEntries(available.map((locale) => [locale, absoluteUrl(`/${locale}${suffix}`)]))
  return {
    canonical: absoluteUrl(`/${lang}${suffix}`),
    languages: { ...languages, "x-default": languages.en ?? languages[available[0]] },
  }
}

export function pageMetadata({
  lang,
  suffix = "",
  title,
  description,
  available = seoLocales,
  article = false,
}: {
  lang: string
  suffix?: string
  title: string
  description: string
  available?: SiteLocale[]
  article?: boolean
}): Metadata {
  const image = {
    url: absoluteUrl(`/og/${localeOf(lang)}.png`),
    width: 1200,
    height: 630,
    alt: seoWords(lang).socialTitle,
  }
  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates(lang, suffix, available),
    openGraph: {
      siteName: appName,
      title,
      description,
      url: absoluteUrl(`/${lang}${suffix}`),
      type: article ? "article" : "website",
      locale: { en: "en_US", ru: "ru_RU", es: "es_ES" }[localeOf(lang)],
      alternateLocale: available
        .filter((locale) => locale !== lang)
        .map((locale) => ({ en: "en_US", ru: "ru_RU", es: "es_ES" })[locale]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  }
}

export function documentationDescription(lang: string, slugs: string[], authored?: string): string {
  if (authored?.trim()) return authored
  const [tool, slug] = slugs
  const description = seoWords(lang).reference[slug as keyof typeof seoCopy.en.reference]
  if (!tools.some((candidate) => candidate.name === tool) || !description)
    throw new Error(`Missing reviewed description for ${lang}/docs/${slugs.join("/")}`)
  return description.replaceAll("{messenger}", tool === "tg" ? "Telegram" : "MAX")
}

export function pageStructuredData({
  lang,
  pathname,
  title,
  description,
  breadcrumbs = [],
  tool,
}: {
  lang: string
  pathname: string
  title: string
  description: string
  breadcrumbs?: { name: string; pathname: string }[]
  tool?: (typeof tools)[number]
}) {
  const url = absoluteUrl(pathname)
  const graph: Record<string, unknown>[] = [
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: appName, inLanguage: seoLocales },
    {
      "@type": tool ? "TechArticle" : "WebPage",
      "@id": `${url}#page`,
      url,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { "@id": `${siteUrl}/#website` },
    },
  ]
  if (breadcrumbs.length > 1)
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumbs`,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.pathname),
      })),
    })
  if (tool)
    graph.push({
      "@type": "SoftwareSourceCode",
      "@id": `${siteUrl}/#${tool.name}`,
      name: tool.name,
      description: tool.summary[localeOf(lang)],
      codeRepository: `https://github.com/${tool.repo}`,
      license: `https://github.com/${tool.repo}/blob/${tool.docsRef ?? "main"}/LICENSE`,
      programmingLanguage: "TypeScript",
      runtimePlatform: "Node.js",
      url: absoluteUrl(`/${lang}/docs/${tool.name}`),
      version: tool.docsRef,
    })
  return { "@context": "https://schema.org", "@graph": graph }
}
