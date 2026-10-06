import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const filesIn = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name)
    return entry.isDirectory() ? (entry.name === "_next" ? [] : filesIn(file)) : [file]
  })
const decode = (text: string) => text.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'")
const attributes = (tag: string) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1].toLowerCase(), decode(match[2] ?? "")]),
  )

export function seoProblems(out: string, origin: string, locales = ["en", "ru", "es"]): string[] {
  const problems: string[] = []
  const normalizedRoot = (url: string | undefined) => (url === origin ? `${origin}/` : url)
  const stableHome = existsSync(join(out, "index.html"))
  if (locales.includes("en") && !stableHome) problems.push("Missing stable English homepage at /")
  const pages = new Map<
    string,
    { html: string; lang: string; metadata: Map<string, string>; alternates: Map<string, string> }
  >()
  for (const file of filesIn(out).filter((file) => file.endsWith(".html"))) {
    const pathname = `/${relative(out, file)
      .replace(/\/index\.html$|\.html$/, "")
      .replace(/^index$/, "")}`
    if (pathname === "/en" && stableHome) {
      const redirects = join(out, "_redirects")
      if (!existsSync(redirects) || !/^\/en\s+\/\s+301$/m.test(readFileSync(redirects, "utf8")))
        problems.push("/en: legacy homepage must permanently redirect to /")
      continue
    }
    const lang = pathname === "/" ? "en" : pathname.split("/")[1]
    if (!locales.includes(lang)) continue
    const raw = readFileSync(file, "utf8")
    const html = raw.replace(/<script\b[\s\S]*?<\/script>/g, "")
    const metadata = new Map(
      [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => {
        const props = attributes(tag)
        return [props.name ?? props.property, props.content] as [string, string]
      }),
    )
    const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag))
    const alternates = new Map(links.filter((link) => link.hreflang).map((link) => [link.hreflang, link.href]))
    pages.set(pathname, { html, lang, metadata, alternates })
    const fail = (message: string) => problems.push(`${pathname}: ${message}`)
    if (pathname === "/" && (/<meta[^>]+http-equiv="refresh"/i.test(html) || /src="\/language\.js"/.test(raw)))
      fail("homepage must not redirect by language")
    const canonical = links.filter((link) => link.rel === "canonical")
    if (canonical.length !== 1 || normalizedRoot(canonical[0]?.href) !== `${origin}${pathname}`)
      fail("canonical must match the public HTTPS page")
    const title = decode(/<title[^>]*>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? "")
    if (!title.trim()) fail("missing title")
    if (!metadata.get("description")?.trim()) fail("missing description")
    if (/noindex/i.test(metadata.get("robots") ?? "")) fail("public sitemap pages must be indexable")
    if (attributes(/<html\b[^>]*>/.exec(html)?.[0] ?? "").lang !== lang) fail("HTML language does not match the route")
    if ((html.match(/<h1\b/g) ?? []).length !== 1) fail("must have exactly one H1")
    if ((html.match(/<main\b/g) ?? []).length !== 1) fail("must have exactly one main landmark")
    for (const key of ["og:title", "twitter:title"])
      if (metadata.get(key) !== title) fail(`${key} must match the page title`)
    for (const key of ["og:description", "twitter:description"])
      if (metadata.get(key) !== metadata.get("description")) fail(`${key} must match the page description`)
    if (normalizedRoot(metadata.get("og:url")) !== `${origin}${pathname}`) fail("Open Graph URL must match canonical")
    const image = metadata.get("og:image")
    if (!image?.startsWith(`${origin}/`) || !existsSync(join(out, new URL(image).pathname)))
      fail("missing or unavailable local social image")
    if (metadata.get("twitter:card") !== "summary_large_image" || metadata.get("twitter:image") !== image)
      fail("Twitter must use the matching large social image")
    const schemas = [...raw.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    if (!schemas.length) fail("missing page structured data")
    for (const [, json] of schemas) {
      try {
        const data = JSON.parse(json) as {
          "@context"?: string
          "@graph"?: {
            "@type"?: string | string[]
            "@id"?: string
            url?: string
            name?: string
            logo?: string
            publisher?: { "@id"?: string }
            mainEntity?: { "@id"?: string }
          }[]
        }
        if (data["@context"] !== "https://schema.org") fail("unexpected structured-data context")
        if (
          !data["@graph"]?.some(
            (node) =>
              typeof node["@type"] === "string" &&
              ["WebPage", "AboutPage", "TechArticle"].includes(node["@type"]) &&
              node.url === `${origin}${pathname}`,
          )
        )
          fail("structured data must identify this page")
        const organization = data["@graph"]?.find(
          (node) => Array.isArray(node["@type"]) && node["@type"].includes("Organization"),
        )
        if (
          organization?.["@id"] !== `${origin}/#organization` ||
          organization.name !== "WireCat" ||
          organization.url !== origin
        )
          fail("missing consistent WireCat organization identity")
        const website = data["@graph"]?.find((node) => node["@type"] === "WebSite")
        if (website?.publisher?.["@id"] !== organization?.["@id"]) fail("website publisher must reference WireCat")
        if (
          !organization?.logo?.startsWith(`${origin}/`) ||
          !existsSync(join(out, new URL(organization.logo).pathname))
        )
          fail("organization logo must be an available local image")
        if (pathname.endsWith("/about")) {
          const about = data["@graph"]?.find((node) => node["@type"] === "AboutPage")
          if (about?.mainEntity?.["@id"] !== organization?.["@id"]) fail("About must describe the WireCat identity")
        }
      } catch {
        fail("invalid JSON-LD")
      }
    }
  }
  if (!pages.size) problems.push("No localized public pages found; refusing an empty SEO check")
  for (const [pathname, page] of pages) {
    const suffix = pathname === "/" ? "" : pathname.slice(page.lang.length + 1)
    for (const lang of locales) {
      const equivalent = lang === "en" && !suffix ? "/" : `/${lang}${suffix}`
      if (!pages.has(equivalent)) continue
      if (normalizedRoot(page.alternates.get(lang)) !== `${origin}${equivalent}`)
        problems.push(`${pathname}: missing or incorrect ${lang} hreflang`)
    }
    if (page.alternates.get("x-default") !== page.alternates.get("en"))
      problems.push(`${pathname}: x-default must use the English equivalent`)
  }
  const sitemap = join(out, "sitemap.xml")
  if (!existsSync(sitemap)) problems.push("Missing sitemap.xml")
  else {
    const xml = readFileSync(sitemap, "utf8")
    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) problems.push("Invalid sitemap namespace")
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1] ?? ""))
    if (new Set(urls).size !== urls.length) problems.push("Duplicate sitemap URLs")
    for (const pathname of pages.keys())
      if (!urls.includes(`${origin}${pathname}`)) problems.push(`${pathname}: missing from sitemap`)
    for (const url of urls)
      if (!pages.has(url.slice(origin.length)) || !url.startsWith(`${origin}/`))
        problems.push(`Non-public sitemap URL: ${url}`)
  }
  const robots = join(out, "robots.txt")
  if (!existsSync(robots) || !readFileSync(robots, "utf8").includes(`Sitemap: ${origin}/sitemap.xml`))
    problems.push("robots.txt must declare the public sitemap")
  return problems
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const site = JSON.parse(readFileSync(join(root, "site.config.json"), "utf8")) as { url: string }
  const problems = seoProblems(join(root, "out"), site.url)
  for (const problem of problems) console.error(problem)
  if (problems.length) process.exit(1)
  console.log("SEO export: metadata, locale alternates, landmarks, JSON-LD, images, sitemap and robots are valid")
}
