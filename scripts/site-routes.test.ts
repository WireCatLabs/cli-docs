import { describe, expect, it } from "vitest"
import { homePath, localeFromPath, localizedPath } from "../lib/site-routes"

describe("stable homepage routing", () => {
  it("keeps English home at root and other English pages prefixed", () => {
    expect(homePath("en")).toBe("/")
    expect(homePath("ru")).toBe("/ru")
    expect(localizedPath("/", "es")).toBe("/es")
    expect(localizedPath("/ru", "en")).toBe("/")
    expect(localizedPath("/ru/docs/max/commands", "en")).toBe("/en/docs/max/commands")
    expect(localizedPath("/en/about", "es")).toBe("/es/about")
    expect(localeFromPath("/")).toBe("en")
    expect(localeFromPath("/ru/docs")).toBe("ru")
  })
})
