import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { seoProblems } from "./check-seo"

describe("production SEO guard", () => {
  let out: string
  const write = (file: string, text: string) => {
    mkdirSync(dirname(join(out, file)), { recursive: true })
    writeFileSync(join(out, file), text)
  }
  beforeEach(() => {
    out = mkdtempSync(join(tmpdir(), "seo-"))
    for (const lang of ["en", "ru"]) {
      const url = `https://example.test/${lang === "en" ? "" : lang}`
      write(
        lang === "en" ? "index.html" : `${lang}.html`,
        `<html lang="${lang}"><title>${lang}</title><meta name="description" content="${lang} description"><meta property="og:title" content="${lang}"><meta property="og:description" content="${lang} description"><meta property="og:url" content="${url}"><meta property="og:image" content="https://example.test/og.png"><meta name="twitter:title" content="${lang}"><meta name="twitter:description" content="${lang} description"><link rel="canonical" href="${url}"><link hreflang="en" href="https://example.test/"><link hreflang="ru" href="https://example.test/ru"><link hreflang="x-default" href="https://example.test/"><main><h1>${lang}</h1></main><script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebPage","url":"${url}"}]}</script></html>`,
      )
    }
    for (const lang of ["en", "ru"]) {
      const file = join(out, lang === "en" ? "index.html" : `${lang}.html`)
      writeFileSync(
        file,
        readFileSync(file, "utf8").replace(
          "</title>",
          '</title><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://example.test/og.png">',
        ),
      )
    }
    const identity = {
      "@type": ["Organization", "Project"],
      "@id": "https://example.test/#organization",
      name: "WireCat",
      url: "https://example.test",
      logo: "https://example.test/logo.png",
    }
    const website = { "@type": "WebSite", publisher: { "@id": identity["@id"] } }
    for (const lang of ["en", "ru"]) {
      const file = join(out, lang === "en" ? "index.html" : `${lang}.html`)
      writeFileSync(
        file,
        readFileSync(file, "utf8").replace(
          '"@graph":[',
          `"@graph":[${JSON.stringify(identity)},${JSON.stringify(website)},`,
        ),
      )
    }
    write("logo.png", "fixture")
    write("og.png", "fixture")
    write(
      "sitemap.xml",
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url><url><loc>https://example.test/ru</loc></url></urlset>',
    )
    write("robots.txt", "User-agent: *\nAllow: /\nSitemap: https://example.test/sitemap.xml\n")
  })
  afterEach(() => rmSync(out, { recursive: true, force: true }))

  it("accepts matching public metadata and a complete reciprocal locale cluster", () => {
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual([])
  })
  it("accepts equivalent root metadata serialized without a trailing slash", () => {
    for (const name of ["index.html", "ru.html"]) {
      const file = join(out, name)
      writeFileSync(
        file,
        readFileSync(file, "utf8")
          .replaceAll('href="https://example.test/"', 'href="https://example.test"')
          .replace(
            'property="og:url" content="https://example.test/"',
            'property="og:url" content="https://example.test"',
          ),
      )
    }
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual([])
  })
  it("rejects an English root that still performs language detection", () => {
    const file = join(out, "index.html")
    writeFileSync(file, `${readFileSync(file, "utf8")}<script src="/language.js"></script>`)
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toContain(
      "/: homepage must not redirect by language",
    )
  })
  it("accepts React's mixed-case HTML attributes", () => {
    for (const lang of ["en", "ru"]) {
      const file = join(out, lang === "en" ? "index.html" : `${lang}.html`)
      writeFileSync(file, readFileSync(file, "utf8").replaceAll("hreflang=", "hrefLang="))
    }
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual([])
  })
  it("rejects an unrelated publisher and a missing project logo", () => {
    const file = join(out, "index.html")
    writeFileSync(
      file,
      readFileSync(file, "utf8")
        .replace(
          '"publisher":{"@id":"https://example.test/#organization"}',
          '"publisher":{"@id":"https://other.test/#organization"}',
        )
        .replace('"logo":"https://example.test/logo.png"', '"logo":"https://example.test/missing.png"'),
    )
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual(
      expect.arrayContaining([
        "/: website publisher must reference WireCat",
        "/: organization logo must be an available local image",
      ]),
    )
  })
  it("rejects a canonical and social field accidentally inherited from another page", () => {
    const file = join(out, "ru.html")
    writeFileSync(
      file,
      readFileSync(file, "utf8")
        .replace('rel="canonical" href="https://example.test/ru"', 'rel="canonical" href="https://example.test/"')
        .replace('name="twitter:title" content="ru"', 'name="twitter:title" content="en"'),
    )
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual(
      expect.arrayContaining([
        "/ru: canonical must match the public HTTPS page",
        "/ru: twitter:title must match the page title",
      ]),
    )
  })
  it("rejects missing alternate metadata and a broken page graph", () => {
    const file = join(out, "ru.html")
    writeFileSync(
      file,
      readFileSync(file, "utf8")
        .replace('<link hreflang="en" href="https://example.test/">', "")
        .replace('"url":"https://example.test/ru"', '"url":"https://example.test/"'),
    )
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual(
      expect.arrayContaining(["/ru: missing or incorrect en hreflang", "/ru: structured data must identify this page"]),
    )
  })
  it("rejects sitemap omissions and accidental non-public entries", () => {
    write(
      "sitemap.xml",
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/</loc></url><url><loc>https://example.test/404</loc></url></urlset>',
    )
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual(
      expect.arrayContaining(["/ru: missing from sitemap", "Non-public sitemap URL: https://example.test/404"]),
    )
  })
  it("rejects accidentally noindexed public pages and stale Twitter images", () => {
    const file = join(out, "index.html")
    writeFileSync(
      file,
      readFileSync(file, "utf8")
        .replace("</title>", '</title><meta name="robots" content="noindex,follow">')
        .replace(
          'name="twitter:image" content="https://example.test/og.png"',
          'name="twitter:image" content="https://example.test/stale.png"',
        ),
    )
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual(
      expect.arrayContaining([
        "/: public sitemap pages must be indexable",
        "/: Twitter must use the matching large social image",
      ]),
    )
  })
})
