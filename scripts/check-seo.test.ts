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
      const url = `https://example.test/${lang}`
      write(
        `${lang}.html`,
        `<html lang="${lang}"><title>${lang}</title><meta name="description" content="${lang} description"><meta property="og:title" content="${lang}"><meta property="og:description" content="${lang} description"><meta property="og:url" content="${url}"><meta property="og:image" content="https://example.test/og.png"><meta name="twitter:title" content="${lang}"><meta name="twitter:description" content="${lang} description"><link rel="canonical" href="${url}"><link hreflang="en" href="https://example.test/en"><link hreflang="ru" href="https://example.test/ru"><link hreflang="x-default" href="https://example.test/en"><main><h1>${lang}</h1></main><script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebPage","url":"${url}"}]}</script></html>`,
      )
    }
    for (const lang of ["en", "ru"]) {
      const file = join(out, `${lang}.html`)
      writeFileSync(
        file,
        readFileSync(file, "utf8").replace(
          "</title>",
          '</title><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://example.test/og.png">',
        ),
      )
    }
    write("og.png", "fixture")
    write(
      "sitemap.xml",
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/en</loc></url><url><loc>https://example.test/ru</loc></url></urlset>',
    )
    write("robots.txt", "User-agent: *\nAllow: /\nSitemap: https://example.test/sitemap.xml\n")
  })
  afterEach(() => rmSync(out, { recursive: true, force: true }))

  it("accepts matching public metadata and a complete reciprocal locale cluster", () => {
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual([])
  })
  it("accepts React's mixed-case HTML attributes", () => {
    for (const lang of ["en", "ru"]) {
      const file = join(out, `${lang}.html`)
      writeFileSync(file, readFileSync(file, "utf8").replaceAll("hreflang=", "hrefLang="))
    }
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual([])
  })
  it("rejects a canonical and social field accidentally inherited from another page", () => {
    const file = join(out, "ru.html")
    writeFileSync(
      file,
      readFileSync(file, "utf8")
        .replace('rel="canonical" href="https://example.test/ru"', 'rel="canonical" href="https://example.test/en"')
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
        .replace('<link hreflang="en" href="https://example.test/en">', "")
        .replace('"url":"https://example.test/ru"', '"url":"https://example.test/en"'),
    )
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual(
      expect.arrayContaining(["/ru: missing or incorrect en hreflang", "/ru: structured data must identify this page"]),
    )
  })
  it("rejects sitemap omissions and accidental non-public entries", () => {
    write(
      "sitemap.xml",
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://example.test/en</loc></url><url><loc>https://example.test/404</loc></url></urlset>',
    )
    expect(seoProblems(out, "https://example.test", ["en", "ru"])).toEqual(
      expect.arrayContaining(["/ru: missing from sitemap", "Non-public sitemap URL: https://example.test/404"]),
    )
  })
  it("rejects accidentally noindexed public pages and stale Twitter images", () => {
    const file = join(out, "en.html")
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
        "/en: public sitemap pages must be indexable",
        "/en: Twitter must use the matching large social image",
      ]),
    )
  })
})
