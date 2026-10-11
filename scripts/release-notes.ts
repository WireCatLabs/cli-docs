import { createHash } from "node:crypto"
import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

type Review = { version: string; roadmapSha256: string; reviewedAt: string; conclusion: string }
export const roadmapFingerprint = (text: string) =>
  createHash("sha256").update(text.replace(/\r\n/g, "\n").trim()).digest("hex")
export function releaseNotesProblems(
  version: string,
  changelog: string,
  roadmap: string | undefined,
  review?: Review,
): string[] {
  const number = version.replace(/^v/, "")
  const headings = [...changelog.matchAll(/^## (\d+\.\d+\.\d+)(?:\s|$)/gm)].map((match) => match[1])
  const problems: string[] = []
  if (headings[0] !== number)
    problems.push(`changelog: newest released entry must be ${number}, got ${headings[0] ?? "none"}`)
  const entry = new RegExp(
    `^## ${number.replaceAll(".", "\\.")}(?:\\s[^\\n]*)?\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`,
    "m",
  ).exec(changelog)?.[1]
  if (!entry || !/^\s*-\s+\S/m.test(entry)) problems.push(`changelog: ${number} needs substantive release notes`)
  // A tool without a roadmap page publishes no plans to keep in step with its releases.
  if (roadmap === undefined) return problems
  if (!roadmap.trim() || !/^\s*-\s+\S/m.test(roadmap)) problems.push("roadmap: no planned work or explicit status")
  if (
    !review ||
    review.version !== version ||
    !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt) ||
    !review.conclusion.trim()
  )
    problems.push(`roadmap: record a review for ${version}, including a conclusion when plans are unchanged`)
  else if (review.roadmapSha256 !== roadmapFingerprint(roadmap))
    problems.push("roadmap: changed since review; recheck shipped items and record the new fingerprint")
  return problems
}
export function checkReleaseNotes(root: string): string[] {
  const tools = JSON.parse(readFileSync(join(root, "tools.json"), "utf8")) as {
    name: string
    docsRef: string
    distribution?: "source"
  }[]
  const reviews = JSON.parse(readFileSync(join(root, "docs/release-notes-review.json"), "utf8")) as Record<
    string,
    Review
  >
  return tools.flatMap((tool) => {
    // A reviewed source distribution has no npm/GitHub release to certify.
    if (tool.distribution === "source") return []
    const base = join(root, "content/upstream", tool.name)
    if (!existsSync(join(base, "changelog.md"))) return [`${tool.name}: run pnpm sync before release-note validation`]
    const roadmap = join(base, "roadmap.md")
    return releaseNotesProblems(
      tool.docsRef,
      readFileSync(join(base, "changelog.md"), "utf8"),
      existsSync(roadmap) ? readFileSync(roadmap, "utf8") : undefined,
      reviews[tool.name],
    ).map((problem) => `${tool.name}: ${problem}`)
  })
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..")
  const problems = checkReleaseNotes(root)
  for (const problem of problems) console.error(problem)
  if (problems.length) process.exitCode = 1
  else console.log("Release notes: matching changelog entries and reviewed roadmaps for every pinned release")
}
