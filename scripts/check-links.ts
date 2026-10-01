/**
 * Every link inside the built site leads to a page that exists and, with an anchor, to a heading on
 * it. lychee does the same for links outside the site; it is not used here because it does not
 * decode an anchor, and every Russian heading's anchor reaches the page percent-encoded.
 *
 *   pnpm check:links    after `next build`
 */
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const htmlFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return entry.name === "_next" ? [] : htmlFiles(path)
    return entry.name.endsWith(".html") ? [path] : []
  })

/** The file a site path is served from: `/en/docs/tg` is `en/docs/tg.html` or `en/docs/tg/index.html`. */
const fileFor = (out: string, path: string): string | undefined =>
  [join(out, `${path}.html`), join(out, path, "index.html"), join(out, path)].find(
    (candidate) => existsSync(candidate) && !candidate.endsWith("/"),
  )

export const linkProblems = (out: string): string[] => {
  const ids = new Map<string, Set<string>>()
  const idsOf = (file: string) => {
    let found = ids.get(file)
    if (!found) {
      found = new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((match) => match[1] ?? ""))
      ids.set(file, found)
    }
    return found
  }

  const problems: string[] = []
  for (const file of htmlFiles(out)) {
    const html = readFileSync(file, "utf8")
    for (const [, href = ""] of html.matchAll(/\shref="([^"]+)"/g)) {
      if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/_next/")) continue
      const [address = "", anchor] = href.replace(/&amp;/g, "&").split("#")
      const path = address.split("?")[0] ?? ""
      const target = path === "" ? file : fileFor(out, decodeURIComponent(path).replace(/\/$/, ""))
      const where = relative(out, file)
      if (!target) {
        problems.push(`${where}: ${href} — no such page`)
        continue
      }
      if (anchor && target.endsWith(".html") && !idsOf(target).has(decodeURIComponent(anchor)))
        problems.push(`${where}: ${decodeURIComponent(href)} — no such heading`)
    }
  }
  return [...new Set(problems)]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out")
  const problems = linkProblems(out)
  for (const problem of problems) console.error(problem)
  if (problems.length > 0) process.exit(1)
  console.log("links: ok")
}
