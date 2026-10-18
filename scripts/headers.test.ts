import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

describe("public/_headers", () => {
  it("serves install.ps1 as UTF-8 text so PowerShell reads it as a string", () => {
    const headers = readFileSync("public/_headers", "utf8")
    expect(headers).toMatch(/^\/install\.ps1\n {2}Content-Type: text\/plain; charset=utf-8$/m)
  })
})
