import { describe, expect, it } from "vitest"
import { publicSiteOrigin } from "../lib/site-origin.mjs"

describe("public build origin", () => {
  it("accepts and normalizes the production HTTPS origin", () => {
    expect(publicSiteOrigin("https://wirecat.dev/")).toBe("https://wirecat.dev")
  })
  it.each([
    undefined,
    "",
    "http://wirecat.dev",
    "https://localhost",
    "https://127.0.0.1",
    "https://[::1]",
    "https://preview.local",
    "https://wirecat.dev/en",
    "https://wirecat.dev?preview=1",
    "https://user:secret@wirecat.dev",
  ])("blocks a missing, local or non-origin URL: %s", (value) => {
    expect(() => publicSiteOrigin(value)).toThrow("public HTTPS origin")
  })
})
