import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

describe("public/_headers", () => {
  it("serves install.ps1 as UTF-8 text so PowerShell reads it as a string", () => {
    const headers = readFileSync("public/_headers", "utf8")
    expect(headers).toMatch(/^\/install\.ps1\n {2}Content-Type: text\/plain; charset=utf-8$/m)
  })
})

describe("Microsoft publisher domain proof", () => {
  it("is a tracked JSON file naming the WireCat app and served as application/json", () => {
    const proof = JSON.parse(readFileSync("public/.well-known/microsoft-identity-association.json", "utf8"))
    expect(proof).toEqual({ associatedApplications: [{ applicationId: "f7f05d3a-b948-4d50-b3ce-59c816ce69e9" }] })
    const headers = readFileSync("public/_headers", "utf8")
    expect(headers).toMatch(
      /^\/\.well-known\/microsoft-identity-association\.json\n {2}Content-Type: application\/json$/m,
    )
  })
})
