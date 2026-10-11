import { existsSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { checkFreshness, freshnessReport, type VersionRecord } from "./docs-freshness.ts"

const records = [
  { name: "tg", package: "@wirecat/tg-cli", docsRef: "v0.9.0", source: "tools.json" },
  { name: "memo", package: "@wirecat/cli-memo", docsRef: "v0.11.0", pages: ["memo"], source: "authored-docs.json" },
]
const registry = (versions: Record<string, string>) => async (url: string) => ({
  version: versions[decodeURIComponent(url.split("/").at(-2) ?? "")],
})

describe("docs freshness", () => {
  it("flags a tool whose docs describe an older release, comparing versions as numbers", async () => {
    const rows = await checkFreshness(records, registry({ "@wirecat/tg-cli": "0.10.0", "@wirecat/cli-memo": "0.11.0" }))
    expect(rows.map((row) => [row.name, row.lagging])).toEqual([
      ["tg", true],
      ["memo", false],
    ])
    const report = freshnessReport(rows)
    expect(report).toContain("tg: pnpm docs:updates --prepare")
    expect(report).not.toContain("memo: read the changelog")
  })

  it("names the authored pages to update when a hand-written guide lags", async () => {
    const rows = await checkFreshness(records, registry({ "@wirecat/tg-cli": "0.9.0", "@wirecat/cli-memo": "0.12.0" }))
    expect(freshnessReport(rows)).toContain("content/docs/{memo}*.mdx")
  })

  it("records authored guides that exist in every locale and are not synced", () => {
    const authored = JSON.parse(readFileSync("authored-docs.json", "utf8")) as VersionRecord[]
    const synced = (JSON.parse(readFileSync("tools.json", "utf8")) as VersionRecord[]).map((tool) => tool.name)
    for (const record of authored) {
      expect(record.docsRef).toMatch(/^v\d+\.\d+\.\d+$/)
      expect(synced).not.toContain(record.name)
      for (const page of record.pages ?? [])
        for (const suffix of [".mdx", ".ru.mdx", ".es.mdx"])
          expect(existsSync(`content/docs/${page}${suffix}`)).toBe(true)
    }
  })
})
