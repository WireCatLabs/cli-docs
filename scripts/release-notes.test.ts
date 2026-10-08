import { expect, it } from "vitest"
import { releaseNotesProblems, roadmapFingerprint } from "./release-notes"

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
