import { describe, expect, it } from "vitest"
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
})
