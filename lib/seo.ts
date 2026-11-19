import type { Metadata } from "next"
import siteConfig from "../site.config.json"
import { amoDescriptions } from "./amo-descriptions"
import { attioDescriptions } from "./attio-descriptions"
import { b24Descriptions } from "./b24-descriptions"
import { driveDescriptions } from "./drive-descriptions"
import { gcalDescriptions } from "./gcal-descriptions"
import { linearDescriptions } from "./linear-descriptions"
import { mailDescriptions } from "./mail-descriptions"
import { memoDescriptions } from "./memo-descriptions"
import { notionDescriptions } from "./notion-descriptions"
import { pbxDescriptions } from "./pbx-descriptions"
import { readerGuide } from "./reader-guides"
import seoCopy from "./seo-copy.json"
import { appName, siteUrl, tools } from "./shared"
import { homePath } from "./site-routes"
import { whatsappDescriptions } from "./whatsapp-descriptions"
import { wordpressDescriptions } from "./wordpress-descriptions"
import { ydiskDescriptions } from "./ydisk-descriptions"
import { zoomDescriptions } from "./zoom-descriptions"

export type SiteLocale = keyof typeof seoCopy
export const seoLocales = Object.keys(seoCopy) as SiteLocale[]
export const localeOf = (lang: string): SiteLocale => (lang in seoCopy ? (lang as SiteLocale) : "en")
export const seoWords = (lang: string) => seoCopy[localeOf(lang)]
export const absoluteUrl = (pathname: string) => new URL(pathname, siteUrl).href

export function pageAlternates(lang: string, suffix: string, available = seoLocales) {
  const languages = Object.fromEntries(
    available.map((locale) => [locale, absoluteUrl(suffix ? `/${locale}${suffix}` : homePath(locale))]),
  )
  return {
    canonical: absoluteUrl(suffix ? `/${lang}${suffix}` : homePath(lang)),
    // A page with no English version has no x-default, rather than pretending another language is the default.
    languages: { ...languages, ...(languages.en ? { "x-default": languages.en } : {}) },
  }
}

export function pageMetadata({
  lang,
  suffix = "",
  title,
  description,
  available = seoLocales,
  article = false,
  socialImage,
  canonical,
  published,
}: {
  lang: string
  suffix?: string
  title: string
  description: string
  available?: SiteLocale[]
  article?: boolean
  socialImage?: { pathname: string; alt: string }
  /** Where the original lives, when the page republishes it. */
  canonical?: string
  published?: { date: string; updated?: string; tags: string[] }
}): Metadata {
  const image = {
    url: absoluteUrl(socialImage?.pathname ?? `/og/${localeOf(lang)}.png`),
    width: 1200,
    height: 630,
    alt: socialImage?.alt ?? seoWords(lang).socialTitle,
  }
  const alternates = pageAlternates(lang, suffix, available)
  return {
    title: { absolute: title },
    description,
    alternates: canonical ? { ...alternates, canonical } : alternates,
    openGraph: {
      siteName: appName,
      title,
      description,
      url: canonical ?? absoluteUrl(suffix ? `/${lang}${suffix}` : homePath(lang)),
      ...(article || published
        ? {
            type: "article",
            ...(published
              ? { publishedTime: published.date, modifiedTime: published.updated, tags: published.tags }
              : {}),
          }
        : { type: "website" }),
      locale: { en: "en_US", ru: "ru_RU", es: "es_ES" }[localeOf(lang)],
      alternateLocale: available
        .filter((locale) => locale !== lang)
        .map((locale) => ({ en: "en_US", ru: "ru_RU", es: "es_ES" })[locale]),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  }
}

export function documentationTitle(lang: string, slugs: string[], authored: string): string {
  const tool = tools.find((candidate) => candidate.name === slugs[0])
  if (!tool) return authored
  const words = seoWords(lang)
  if (slugs.length === 1) return words.toolTitles[tool.name as "tg" | "max" | "memo"] ?? tool.displayName ?? authored
  const guide = readerGuide(slugs, lang)
  // Search titles lead with what people type ("Telegram MCP server", "Install the Telegram CLI"); an empty entry keeps
  // the page's own title.
  const templates: Record<string, string> = words.pageTitles
  const template = guide || slugs.length !== 2 ? undefined : (templates[slugs.join("/")] ?? templates[slugs[1]])
  const product = (words.products as Record<string, string>)[tool.name] ?? tool.displayName ?? tool.name
  if (template) return capitalize(template.replaceAll("{product}", product))
  // People search for the product, not the command: "Telegram: People", not "People — tg". `products` is worded to
  // fit inside a sentence (RU «почты»); `labels` names the product on its own.
  return `${toolLabel(lang, tool.name)}: ${guide?.title ?? authored}`
}

/** The product's name on its own (RU «Почта»), as a page title or a link preview shows it. */
export function toolLabel(lang: string, name: string): string {
  const words = seoWords(lang)
  const tool = tools.find((candidate) => candidate.name === name)
  const product = (words.products as Record<string, string>)[name] ?? tool?.displayName ?? name
  return (words.labels as Record<string, string>)[name] ?? capitalize(product)
}

// A tool's index image (`b24.png`) sits beside its pages' folder (`b24/`); the docs home is `index.png`.
export const docsSocialImageSlug = (slugs: string[]) => [
  ...(slugs.length ? slugs : ["index"]).slice(0, -1),
  `${(slugs.length ? slugs : ["index"]).at(-1)}.png`,
]
export const docsSocialImage = (lang: string, slugs: string[]) =>
  `/og/docs/${lang}/${docsSocialImageSlug(slugs).join("/")}`
export const docsSlugsOfImage = (slug: string[]) => {
  const path = slug.join("/").replace(/\.png$/, "")
  return path === "index" ? [] : path.split("/")
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const pageDescription = (lang: string, slugs: string[]) =>
  (seoWords(lang).pageDescriptions as Record<string, string>)[slugs.join("/")]

export function documentationDescription(lang: string, slugs: string[], authored?: string): string {
  const taskDescription = readerGuide(slugs, lang)?.description ?? pageDescription(lang, slugs)
  if (taskDescription) return taskDescription
  if (authored?.trim()) return authored
  const selectedTool = tools.find((candidate) => candidate.name === slugs[0])
  const reviewed = {
    amo: amoDescriptions,
    attio: attioDescriptions,
    b24: b24Descriptions,
    drive: driveDescriptions,
    gcal: gcalDescriptions,
    mail: mailDescriptions,
    memo: memoDescriptions,
    notion: notionDescriptions,
    linear: linearDescriptions,
    pbx: pbxDescriptions,
    wa: whatsappDescriptions,
    wordpress: wordpressDescriptions,
    ydisk: ydiskDescriptions,
  }[selectedTool?.name ?? ""]
  if (reviewed) {
    const description = reviewed[localeOf(lang)][slugs[1] ?? "index"]
    if (!description) throw new Error(`Missing reviewed ${selectedTool?.displayName} description: ${slugs.join("/")}`)
    return description
  }
  if (selectedTool?.name === "zm") {
    const description = zoomDescriptions[localeOf(lang)][slugs[1] ?? "index"]
    if (!description) throw new Error(`Missing reviewed Zoom description: ${slugs.join("/")}`)
    return description
  }
  const [tool, slug] = slugs
  const description = seoWords(lang).reference[slug as keyof typeof seoCopy.en.reference]
  if (!tools.some((candidate) => candidate.name === tool) || !description)
    throw new Error(`Missing reviewed description for ${lang}/docs/${slugs.join("/")}`)
  return description.replaceAll(
    "{messenger}",
    tools.find((candidate) => candidate.name === tool)?.displayName ?? (tool === "tg" ? "Telegram" : "MAX"),
  )
}

export function pageStructuredData({
  lang,
  pathname,
  title,
  description,
  breadcrumbs = [],
  tool,
  aboutProject = false,
  post,
}: {
  lang: string
  pathname: string
  title: string
  description: string
  breadcrumbs?: { name: string; pathname: string }[]
  tool?: (typeof tools)[number]
  aboutProject?: boolean
  post?: { date: string; updated?: string; image: string; keywords: string[] }
}) {
  const url = absoluteUrl(pathname)
  const organizationId = `${siteUrl}/#organization`
  const graph: Record<string, unknown>[] = [
    {
      "@type": ["Organization", "Project"],
      "@id": organizationId,
      name: appName,
      url: siteUrl,
      logo: absoluteUrl("/android-chrome-512x512.png"),
      email: siteConfig.contacts.email,
      sameAs: [siteConfig.community.discord, siteConfig.contacts.telegram, siteConfig.contacts.facebook],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: appName,
      inLanguage: seoLocales,
      publisher: { "@id": organizationId },
    },
    {
      "@type": tool ? "TechArticle" : aboutProject ? "AboutPage" : post ? "BlogPosting" : "WebPage",
      "@id": `${url}#page`,
      url,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { "@id": `${siteUrl}/#website` },
      ...(aboutProject ? { mainEntity: { "@id": organizationId } } : {}),
      ...(post
        ? {
            headline: title,
            datePublished: post.date,
            dateModified: post.updated ?? post.date,
            image: absoluteUrl(post.image),
            keywords: post.keywords,
            author: {
              "@type": "Person",
              name: "Viacheslav Ptsarev",
              url: siteConfig.contacts.maintainerTelegram,
              sameAs: [siteConfig.contacts.founderLinkedin, siteConfig.contacts.founderGithub],
            },
            publisher: { "@id": organizationId },
          }
        : {}),
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
