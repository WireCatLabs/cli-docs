import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { assertDocsReleaseReady } from "./sync"

const releaseRoot = (held: boolean) => {
  const root = mkdtempSync(join(tmpdir(), "wirecat-docs-release-test-"))
  if (held) {
    mkdirSync(join(root, "docs"))
    writeFileSync(join(root, "docs/release-hold.json"), "{}\n")
  }
  return root
}

const production = { GITHUB_ACTIONS: "true", GITHUB_WORKFLOW: "Deploy" }

describe("documentation release hold", () => {
  it("blocks production publication while candidate CLI docs are held", () => {
    expect(() => assertDocsReleaseReady(releaseRoot(true), production)).toThrow("Production docs are held")
  })

  it("allows production when the release hold is removed", () => {
    expect(() => assertDocsReleaseReady(releaseRoot(false), production)).not.toThrow()
  })

  it("keeps CI and local review builds available during release preparation", () => {
    const root = releaseRoot(true)
    expect(() => assertDocsReleaseReady(root, { GITHUB_ACTIONS: "true", GITHUB_WORKFLOW: "CI" })).not.toThrow()
    expect(() => assertDocsReleaseReady(root, {})).not.toThrow()
  })
})
