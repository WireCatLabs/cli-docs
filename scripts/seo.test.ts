import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StructuredData } from "../components/structured-data"
import {
  documentationDescription,
  pageAlternates,
  pageMetadata,
  pageStructuredData,
  seoLocales,
  seoWords,
} from "../lib/seo"
import { tools } from "../lib/shared"

describe("localized SEO", () => {
  it.each(seoLocales)("aligns search, social and canonical fields in %s", (lang) => {
    const words = seoWords(lang)
    const metadata = pageMetadata({
      lang,
      suffix: "/docs/tg/usage",
      title: words.homeTitle,
      description: words.homeDescription,
    })
    expect(metadata.alternates?.canonical).toBe(`https://wirecat.dev/${lang}/docs/tg/usage`)
    expect(metadata.alternates?.languages).toEqual({
      en: "https://wirecat.dev/en/docs/tg/usage",
      ru: "https://wirecat.dev/ru/docs/tg/usage",
      es: "https://wirecat.dev/es/docs/tg/usage",
      "x-default": "https://wirecat.dev/en/docs/tg/usage",
    })
    expect(metadata.openGraph).toMatchObject({ title: words.homeTitle, description: words.homeDescription })
    expect(metadata.twitter).toMatchObject({
      title: words.homeTitle,
      description: words.homeDescription,
      card: "summary_large_image",
    })
  })

  it("does not announce a locale whose equivalent page is unavailable", () => {
    expect(pageAlternates("ru", "/docs/tg/new", ["en", "ru"]).languages).not.toHaveProperty("es")
  })

  it("uses authored descriptions and refuses unknown references without reviewed copy", () => {
    expect(documentationDescription("ru", ["tg", "commands"], "Reviewed text")).toBe("Reviewed text")
    expect(() => documentationDescription("en", ["tg", "invented"])).toThrow("Missing reviewed description")
  })

  it("covers all reviewed tool reference sections in every locale with provider-specific descriptions", () => {
    const slugs = [
      "installation",
      "usage",
      "commands",
      "configuration",
      "sessions",
      "archive",
      "search",
      "recipes",
      "bot",
      "groups",
      "mcp",
      "remote",
      "diagnostics",
      "troubleshooting",
      "security",
      "roadmap",
      "changelog",
    ]
    for (const lang of seoLocales) {
      const descriptions = new Set<string>()
      for (const tool of tools)
        for (const slug of slugs) {
          const description = documentationDescription(lang, [tool.name, slug])
          expect(description).toContain(tool.name === "tg" ? "Telegram" : "MAX")
          expect(description).not.toContain("{messenger}")
          descriptions.add(description)
        }
      expect(descriptions.size).toBe(34)
    }
  })
})

describe("truthful structured data", () => {
  it("uses absolute breadcrumbs and released source facts without unsupported adoption/ratings", () => {
    const data = pageStructuredData({
      lang: "ru",
      pathname: "/ru/docs/tg",
      title: "Telegram",
      description: "Описание",
      tool: tools[1],
      breadcrumbs: [
        { name: "Главная", pathname: "/ru" },
        { name: "Документация", pathname: "/ru/docs" },
        { name: "Telegram", pathname: "/ru/docs/tg" },
      ],
    })
    expect(data["@graph"].find((node) => node["@type"] === "BreadcrumbList")).toMatchObject({
      itemListElement: [
        { position: 1, item: "https://wirecat.dev/ru" },
        { position: 2, item: "https://wirecat.dev/ru/docs" },
        { position: 3, item: "https://wirecat.dev/ru/docs/tg" },
      ],
    })
    expect(data["@graph"].find((node) => node["@type"] === "SoftwareSourceCode")).toMatchObject({
      codeRepository: "https://github.com/leemour/tg-cli",
      version: tools[1].docsRef,
    })
    expect(JSON.stringify(data)).not.toMatch(/aggregateRating|reviewCount|downloadCount/)
  })

  it("cannot close its script element through a metadata string", () => {
    const html = renderToStaticMarkup(
      createElement(StructuredData, { data: { name: "</script><script>alert(1)</script>" } }),
    )
    expect(html.match(/<script/g)).toHaveLength(1)
    expect(html).toContain("\\u003c/script>")
  })
})
