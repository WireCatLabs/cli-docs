import { describe, expect, it } from "vitest"
import { docsPage, docsPages } from "../lib/docs-pages"
import { docsSlugsOfImage, docsSocialImage, docsSocialImageSlug } from "../lib/seo"

describe("docs link preview images", () => {
  it.each([
    [[], "/og/docs/ru/index.png"],
    [["b24"], "/og/docs/ru/b24.png"],
    [["b24", "installation"], "/og/docs/ru/b24/installation.png"],
  ])("%j has one image path the route builds and reads back", (slugs, path) => {
    expect(docsSocialImage("ru", slugs)).toBe(path)
    expect(docsSlugsOfImage(docsSocialImageSlug(slugs))).toEqual(slugs)
  })

  it("lists every page in every language from its frontmatter", () => {
    expect(docsPage("ru", [])?.title).toBeTruthy()
    expect(docsPage("es", ["desktop", "ai-model"])?.lang).toBe("es")
    expect(docsPage("ru", ["beeline"])).toMatchObject({ lang: "ru", slugs: ["beeline"] })
    expect([...docsPages().values()].every((page) => !page.slugs.includes("index"))).toBe(true)
  })
})
