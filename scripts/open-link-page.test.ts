import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { describe, expect, it } from "vitest"
import { i18n } from "@/lib/i18n"
import fixture from "./fixtures/links-v1.json"

const html = readFileSync("public/o.html", "utf8")
const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1] ?? ""

type Element = { textContent: string; href?: string; hidden: boolean }

const visit = (hash: string, languages: string[] = ["en-GB"]) => {
  const elements = new Map<string, Element>()
  const element = (id: string) => {
    if (!elements.has(id)) elements.set(id, { textContent: "", hidden: id === "offer" })
    return elements.get(id) as Element
  }
  const navigations: string[] = []
  const location = {
    hash,
    set href(url: string) {
      navigations.push(url)
    },
  }
  const document = { documentElement: { lang: "en" }, getElementById: element }
  runInNewContext(script, { location, document, navigator: { languages, language: languages[0] } })
  return { navigations, element, lang: document.documentElement.lang }
}

describe("the /o deep link page", () => {
  it("is static, noindex and sends no referrer", () => {
    expect(html).toMatch(/<meta name="robots" content="noindex">/)
    expect(html).toMatch(/<meta name="referrer" content="no-referrer">/)
    expect(html).toMatch(/default-src 'none'/)
    expect(html).not.toMatch(/<script\b[^>]*\bsrc=/)
  })

  it.each(fixture.valid)("hands $path to the app", ({ web, app }) => {
    const page = visit(new URL(web).hash)
    expect(page.navigations).toEqual([app])
    expect(page.element("open").href).toBe(app)
    expect(page.element("offer").hidden).toBe(false)
  })

  it.each([...fixture.refused, { path: "", why: "no fragment" }])("refuses $why", ({ path }) => {
    const page = visit(`#${path}`)
    expect(page.navigations).toEqual([])
    expect(page.element("offer").hidden).toBe(true)
    expect(page.element("status").textContent).toBe("This is not a WireCat link.")
  })

  it("ignores a query after the path", () => {
    expect(visit(`#${fixture.ignored_query[0]?.path}`).navigations).toEqual(["wirecat://open/v1/task/80"])
  })

  it("never writes the fragment into the page", () => {
    const page = visit("#/v1/task/%3Cimg%20src%3Dx%3E")
    expect(page.navigations).toEqual(["wirecat://open/v1/task/%3Cimg%20src%3Dx%3E"])
    expect(page.element("status").textContent).not.toContain("img")
  })

  it.each(i18n.languages)("speaks %s to a browser that asks for it", (lang) => {
    const page = visit("#/v1/task/80", [`${lang}-XX`])
    expect(page.lang).toBe(lang)
    expect(page.element("download").href).toBe(`/${lang}/download`)
    expect(page.element("open").textContent).not.toBe("")
  })

  it("falls back to English for a language the site does not have", () => {
    const page = visit("#/v1/task/80", ["de-DE", "fr"])
    expect(page.lang).toBe("en")
    expect(page.element("open").textContent).toBe("Open in WireCat")
  })

  it("picks the first site language among the browser's", () => {
    expect(visit("#/v1/task/80", ["de-DE", "es-419", "ru"]).lang).toBe("es")
  })
})
