import { readdirSync, readFileSync } from "node:fs"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { StructuredData } from "../components/structured-data"
import {
  documentationDescription,
  documentationTitle,
  pageAlternates,
  pageMetadata,
  pageStructuredData,
  seoLocales,
  seoWords,
} from "../lib/seo"
import { tools } from "../lib/shared"

describe("localized SEO", () => {
  it("uses the stable English root for home alternates without changing subpages", () => {
    expect(pageAlternates("en", "")).toEqual({
      canonical: "https://wirecat.dev/",
      languages: {
        en: "https://wirecat.dev/",
        ru: "https://wirecat.dev/ru",
        es: "https://wirecat.dev/es",
        "x-default": "https://wirecat.dev/",
      },
    })
    expect(pageMetadata({ lang: "en", title: "Home", description: "Home" }).openGraph).toMatchObject({
      url: "https://wirecat.dev/",
    })
  })
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

  it.each(seoLocales)(
    "describes product intent on provider entry pages without relabeling shared guides in %s",
    (lang) => {
      expect(documentationTitle(lang, ["tg"], "Telegram")).toContain("Telegram")
      expect(documentationTitle(lang, ["tg"], "Telegram")).toContain("CLI")
      expect(documentationTitle(lang, ["max"], "MAX")).toContain("MAX")
      expect(documentationTitle(lang, ["max"], "MAX")).toContain("CLI")
      expect(documentationTitle(lang, ["agents"], "Connect your agent")).toBe("Connect your agent")
      expect(documentationTitle(lang, ["tg", "limits"], "Limits")).toBe("Telegram: Limits")
      expect(documentationTitle(lang, ["pbx", "usage"], "Use it")).toContain("Asterisk")
      expect(documentationTitle(lang, ["pbx"], "Asterisk")).toContain("FreePBX")
    },
  )

  it.each(seoLocales)("leads search titles with the service and MCP or CLI in %s", (lang) => {
    for (const tool of tools) {
      const titles = ["mcp", "installation", "commands"].map((slug) =>
        documentationTitle(lang, [tool.name, slug], slug),
      )
      for (const title of titles) {
        expect(title).not.toContain("{")
        expect(title).toMatch(/MCP|CLI/)
      }
      expect(seoWords(lang).toolTitles).toHaveProperty(tool.name)
    }
    expect(documentationTitle(lang, ["memo", "archive"], "Keeping Memo up to date")).toBe(
      "Memo: Keeping Memo up to date",
    )
    expect(documentationDescription(lang, ["tg", "mcp"], "Synced text")).toContain("Telegram")
  })

  it.each(seoLocales)("keeps every keyword title within 70 characters with the brand in %s", (lang) => {
    const words = seoWords(lang)
    const slugs = Object.keys(words.pageTitles).filter((key) => !key.includes("/"))
    const titles = tools.flatMap((tool) => [
      documentationTitle(lang, [tool.name], tool.name),
      ...slugs.map((slug) => documentationTitle(lang, [tool.name, slug], slug)),
    ])
    for (const key of Object.keys(words.pageTitles).filter((key) => key.includes("/")))
      titles.push(documentationTitle(lang, key.split("/"), key))
    // Site pages carry their search title in frontmatter; tool pages synced from releases are checked by the export.
    const suffix = lang === "en" ? /^[^.]+\.mdx?$/ : new RegExp(`^[^.]+\\.${lang}\\.mdx?$`)
    for (const dir of ["content/docs", "content/docs/desktop"])
      for (const file of readdirSync(dir).filter((name) => suffix.test(name)))
        titles.push(/^title:\s*"?(.*?)"?$/m.exec(readFileSync(`${dir}/${file}`, "utf8"))?.[1] ?? file)
    expect(titles.filter((title) => `${title} · WireCat`.length > 70)).toEqual([])
  })

  it("names the product on its own in subpage titles without a template", () => {
    expect(documentationTitle("ru", ["mail", "providers"], "Подготовка почтового ящика")).toBe(
      "Почта: Подготовка почтового ящика",
    )
    expect(documentationTitle("es", ["mail", "outlook"], "Conectar Outlook")).toBe("Correo: Conectar Outlook")
    expect(documentationTitle("en", ["max", "limits"], "Limits")).toBe("MAX: Limits")
    expect(documentationTitle("ru", ["gcal", "commands"], "x")).toContain("Google Calendar")
    expect(seoWords("ru").toolTitles.gcal).toContain("Google Calendar")
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
      "compare",
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
      for (const tool of tools.filter((tool) => tool.name === "tg" || tool.name === "max"))
        for (const slug of slugs) {
          const description = documentationDescription(lang, [tool.name, slug])
          expect(description).toContain(tool.name === "tg" ? "Telegram" : "MAX")
          expect(description).not.toContain("{messenger}")
          descriptions.add(description)
        }
      expect(descriptions.size).toBe(36)
    }
  })
  it("describes every page a tool publishes, the roadmap included, in every locale", () => {
    const pages = ["index", "installation", "usage", "commands", "configuration", "security", "troubleshooting"]
    for (const lang of seoLocales)
      for (const slug of [...pages, "roadmap", "changelog", "mcp", "permissions", "scenarios"])
        expect(() => documentationDescription(lang, ["b24", slug]), `${lang} b24/${slug}`).not.toThrow()
  })
  it("describes every page the amoCRM CLI publishes in every locale", () => {
    const slugs = ["index", "installation", "usage", "commands", "configuration", "troubleshooting", "security"]
    for (const lang of seoLocales)
      for (const slug of [...slugs, "changelog", "compare", "roadmap", "mcp", "permissions", "scenarios"])
        expect(() => documentationDescription(lang, ["amo", slug]), `${lang} amo/${slug}`).not.toThrow()
  })
  it("describes every page the Linear CLI publishes in every locale", () => {
    const slugs = ["index", "installation", "usage", "commands", "configuration", "troubleshooting", "security"]
    for (const lang of seoLocales)
      for (const slug of [...slugs, "changelog", "compare", "roadmap"])
        expect(() => documentationDescription(lang, ["linear", slug]), `${lang} linear/${slug}`).not.toThrow()
  })
  it("describes every page the WordPress CLI publishes in every locale", () => {
    const slugs = ["index", "installation", "usage", "commands", "configuration", "troubleshooting", "security"]
    for (const lang of seoLocales)
      for (const slug of [...slugs, "changelog", "compare", "roadmap", "mcp", "permissions"])
        expect(() => documentationDescription(lang, ["wordpress", slug]), `${lang} wordpress/${slug}`).not.toThrow()
  })
  it("describes every page the Yandex Disk CLI publishes in every locale", () => {
    for (const lang of seoLocales)
      for (const slug of [
        "index",
        "installation",
        "usage",
        "search",
        "recipes",
        "mirrors",
        "mcp",
        "commands",
        "configuration",
        "troubleshooting",
        "security",
        "changelog",
        "compare",
        "roadmap",
      ])
        expect(() => documentationDescription(lang, ["ydisk", slug]), `${lang} ydisk/${slug}`).not.toThrow()
  })
  it("describes every page the Notion CLI publishes in every locale", () => {
    const slugs = ["index", "installation", "usage", "commands", "configuration", "troubleshooting", "security"]
    for (const lang of seoLocales)
      for (const slug of [...slugs, "changelog", "compare", "roadmap"])
        expect(() => documentationDescription(lang, ["notion", slug]), `${lang} notion/${slug}`).not.toThrow()
  })

  it("describes every page the Asterisk CLI publishes in every locale", () => {
    const slugs = ["index", "installation", "asterisk", "usage", "commands", "configuration", "troubleshooting"]
    for (const lang of seoLocales)
      for (const slug of [...slugs, "security", "changelog", "compare", "roadmap"])
        expect(() => documentationDescription(lang, ["pbx", slug]), `${lang} pbx/${slug}`).not.toThrow()
  })
  it("renders the newly released Memo comparison metadata in every locale", () => {
    for (const lang of seoLocales) {
      expect(documentationDescription(lang, ["memo", "compare"])).toContain("Memo")
      expect(documentationTitle(lang, ["memo", "compare"], "Comparison")).toContain("Memo")
    }
  })

  it("describes released Drive installation and changelog without source-build setup", () => {
    for (const lang of seoLocales) {
      const installation = documentationDescription(lang, ["drive", "installation"])
      expect(installation).toContain("npm")
      expect(installation).toContain("WireCat")
      expect(documentationDescription(lang, ["drive", "changelog"])).toContain("Google Drive")
      expect(documentationTitle(lang, ["drive"], "Google Drive")).toContain("Google Drive")
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
      codeRepository: "https://github.com/WireCatLabs/tg-cli",
      version: tools[1].docsRef,
    })
    expect(JSON.stringify(data)).not.toMatch(/aggregateRating|reviewCount|downloadCount/)
  })

  it.each(seoLocales)("identifies the same factual WireCat project and publisher in %s", (lang) => {
    for (const aboutProject of [false, true]) {
      const data = pageStructuredData({
        lang,
        pathname: `/${lang}${aboutProject ? "/about" : ""}`,
        title: "WireCat",
        description: "Open-source tools",
        aboutProject,
      })
      const organization = data["@graph"].find(
        (node) => Array.isArray(node["@type"]) && node["@type"].includes("Organization"),
      )
      expect(organization).toMatchObject({
        "@type": ["Organization", "Project"],
        "@id": "https://wirecat.dev/#organization",
        name: "WireCat",
        url: "https://wirecat.dev",
        logo: "https://wirecat.dev/android-chrome-512x512.png",
        email: "hello@wirecat.dev",
      })
      expect(data["@graph"].find((node) => node["@type"] === "WebSite")).toMatchObject({
        publisher: { "@id": organization?.["@id"] },
      })
      if (aboutProject)
        expect(data["@graph"].find((node) => node["@type"] === "AboutPage")).toMatchObject({
          mainEntity: { "@id": organization?.["@id"] },
        })
      expect(JSON.stringify(data)).not.toMatch(/"Person"|legalName|founder|taxID|aggregateRating/)
    }
  })

  it("cannot close its script element through a metadata string", () => {
    const html = renderToStaticMarkup(
      createElement(StructuredData, { data: { name: "</script><script>alert(1)</script>" } }),
    )
    expect(html.match(/<script/g)).toHaveLength(1)
    expect(html).toContain("\\u003c/script>")
  })
})

describe("Zoom descriptions", () => {
  it("names meeting tasks for every reviewed page and locale", () => {
    for (const lang of ["en", "ru", "es"])
      for (const slug of [
        "index",
        "installation",
        "zoom-app",
        "archive",
        "search",
        "topic-search",
        "mcp",
        "remote-meetings",
        "roadmap",
        "commands",
        "configuration",
        "sessions",
        "usage",
        "security",
        "troubleshooting",
        "changelog",
      ])
        expect(documentationDescription(lang, slug === "index" ? ["zm"] : ["zm", slug]).length).toBeGreaterThan(20)
  })
})
