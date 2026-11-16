import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { expect, it } from "vitest"
import { checkReleaseNotes, releaseNotesProblems, roadmapFingerprint } from "./release-notes"

const roadmap = "# Roadmap\n\n- Planned capability\n"
const review = {
  version: "v1.2.0",
  roadmapSha256: roadmapFingerprint(roadmap),
  reviewedAt: "2026-10-08",
  conclusion: "Reviewed shipped features; plans unchanged",
}
it("rejects a new release with stale changelog or unreviewed roadmap", () => {
  expect(releaseNotesProblems("v1.3.0", "## 1.2.0\n\n- Existing change\n", roadmap, review)).toEqual(
    expect.arrayContaining([
      expect.stringContaining("newest released entry"),
      expect.stringContaining("record a review"),
    ]),
  )
})
it("accepts unchanged plans only with a matching review and rejects edited plans", () => {
  const changelog = "## 1.2.0 — today\n\n### New\n\n- Released capability\n"
  expect(releaseNotesProblems("v1.2.0", changelog, roadmap, review)).toEqual([])
  expect(releaseNotesProblems("v1.2.0", changelog, `${roadmap}- Another plan\n`, review)).toEqual([
    expect.stringContaining("changed since review"),
  ])
})
it("checks only the changelog of a tool that publishes no roadmap", () => {
  expect(releaseNotesProblems("v1.2.0", "## 1.2.0\n\n- Released capability\n", undefined)).toEqual([])
  expect(releaseNotesProblems("v1.3.0", "## 1.2.0\n\n- Released capability\n", undefined)).not.toContainEqual(
    expect.stringContaining("roadmap"),
  )
})
it("fails a pinned release whose roadmap review is still for the previous version (pbx v0.6.0)", () => {
  const root = mkdtempSync(join(tmpdir(), "release-notes-"))
  try {
    mkdirSync(join(root, "docs"))
    mkdirSync(join(root, "content/upstream/pbx"), { recursive: true })
    writeFileSync(join(root, "tools.json"), JSON.stringify([{ name: "pbx", docsRef: "v0.6.0" }]))
    writeFileSync(join(root, "content/upstream/pbx/changelog.md"), "## 0.6.0\n\n- Install and connect in one page\n")
    writeFileSync(join(root, "content/upstream/pbx/roadmap.md"), roadmap)
    writeFileSync(
      join(root, "docs/release-notes-review.json"),
      JSON.stringify({ pbx: { ...review, version: "v0.5.0" } }),
    )
    expect(checkReleaseNotes(root)).toEqual([
      "pbx: roadmap: record a review for v0.6.0, including a conclusion when plans are unchanged",
    ])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
