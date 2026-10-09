// pnpm docs:translation check|accept|corrections <tool>/<slug>.<lang> ...
// check: the translation's structure against the captured source, and whether its fingerprint is current.
// accept: records the source fingerprint — only after the changed prose was reviewed and check passes.
// corrections: applies scripts/docs-corrections.json to the page (the translation, or the source for the
// tool's own language) and reports every replacement that no longer matches exactly once.
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { fingerprint, translationProblems } from "./localize.ts"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const [mode, ...ids] = process.argv.slice(2)
if (!["check", "accept", "corrections"].includes(mode) || ids.length === 0) {
  console.error("usage: pnpm docs:translation check|accept|corrections <tool>/<slug>.<lang> ...")
  process.exit(2)
}
const hashesPath = join(root, "translations/sources.json")
const hashes = JSON.parse(readFileSync(hashesPath, "utf8")) as Record<string, string>
type Correction = { tool: string; slug: string; replacements: Record<string, { before: string; after: string }[]> }
const corrections = JSON.parse(readFileSync(join(root, "scripts/docs-corrections.json"), "utf8")) as Correction[]
let failed = false
for (const id of ids) {
  const [tool, rest] = id.split("/")
  const slug = rest.slice(0, rest.lastIndexOf("."))
  const lang = rest.slice(rest.lastIndexOf(".") + 1)
  const original = readFileSync(join(root, "content/upstream", tool, `${slug}.md`), "utf8")
  const path = join(root, "translations", tool, `${slug}.${lang}.md`)
  if (mode === "corrections") {
    let text = existsSync(path) ? readFileSync(path, "utf8") : original
    const replacements = corrections
      .filter((entry) => entry.tool === tool && entry.slug === slug)
      .flatMap((entry) => entry.replacements[lang] ?? [])
    let broken = 0
    for (const { before, after } of replacements) {
      const count = before ? text.split(before).length - 1 : 0
      if (count !== 1) {
        broken++
        console.log(`${id}: correction matches ${count} times: ${JSON.stringify(before.slice(0, 120))}`)
      } else text = text.replace(before, () => after)
    }
    console.log(`${id}: ${replacements.length} corrections, ${broken} broken`)
    if (broken) failed = true
    continue
  }
  const problems = translationProblems(original, readFileSync(path, "utf8"))
  const current = hashes[id] === fingerprint(original)
  console.log(
    `${id}: ${problems.length ? `PROBLEMS ${problems.join(", ")}` : "structure ok"}; fingerprint ${current ? "current" : "STALE"}`,
  )
  if (problems.length) failed = true
  else if (mode === "accept") hashes[id] = fingerprint(original)
}
if (mode === "accept") writeFileSync(hashesPath, `${JSON.stringify(hashes, null, 2)}\n`)
if (failed) process.exitCode = 1
