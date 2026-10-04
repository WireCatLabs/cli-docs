/**
 * Every link inside the built site leads to a page that exists and, with an anchor, to a heading on
 * it. lychee does the same for links outside the site; it is not used here because it does not
 * decode an anchor, and every Russian heading's anchor reaches the page percent-encoded.
 *
 *   pnpm check:links    after `next build`
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { fromMarkdown } from "mdast-util-from-markdown"

const outputFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return entry.name === "_next" ? [] : outputFiles(path)
    return [path]
  })

/** The file a site path is served from: `/en/docs/tg` is `en/docs/tg.html` or `en/docs/tg/index.html`. */
const fileFor = (out: string, path: string): string | undefined =>
  [join(out, `${path}.html`), join(out, path, "index.html"), join(out, path)].find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  )

export const linkProblems = (out: string, origin = "https://wirecat.dev"): string[] => {
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
  for (const file of outputFiles(out).filter((file) => file.endsWith(".html"))) {
    const html = readFileSync(file, "utf8")
    const seen = new Set<string>()
    for (const [, id = ""] of html.matchAll(/\sid="([^"]+)"/g)) {
      if (seen.has(id)) problems.push(`${relative(out, file)}: duplicate id "${id}"`)
      seen.add(id)
    }
    for (const [, href = ""] of html.matchAll(/\shref="([^"]+)"/g)) {
      const url = new URL(href.replace(/&amp;/g, "&"), `${origin}/${relative(out, file)}`)
      if (url.origin !== origin || url.pathname.startsWith("/_next/")) continue
      const target = fileFor(out, decodeURIComponent(url.pathname).replace(/\/$/, ""))
      const anchor = url.hash.slice(1)
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

type MarkdownNode = { type: string; url?: string; value?: string; children?: MarkdownNode[] }

export const markdownLinkProblems = (out: string, origin = "https://wirecat.dev"): string[] => {
  const problems: string[] = []
  const headingIds = new Map<string, Set<string>>()
  const htmlIds = (file: string) => {
    if (!headingIds.has(file))
      headingIds.set(file, new Set([...readFileSync(file, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1] ?? "")))
    return headingIds.get(file)
  }
  for (const file of outputFiles(out).filter((file) => file.endsWith(".md"))) {
    const where = relative(out, file)
    const visit = (node: MarkdownNode) => {
      if (
        node.type === "html" &&
        /<(?:InstallationGuide|AgentInstallPrompt|DocTerm|NodeSetupPrompt)(?:\s|\/|>)/.test(node.value ?? "")
      )
        problems.push(`${where}: Documentation component was not expanded for Markdown readers`)
      if (node.url !== undefined && ["link", "image", "definition"].includes(node.type)) {
        const target = new URL(node.url, `${origin}/${where}`)
        if (target.origin === origin) {
          const destination = fileFor(out, decodeURIComponent(target.pathname))
          if (!destination) problems.push(`${where}: ${node.url} — no such page (${target.pathname})`)
          else if (target.hash) {
            const header = destination.endsWith(".md")
              ? /\((\/[^)]+)\)$/.exec(readFileSync(destination, "utf8").split("\n")[0] ?? "")?.[1]
              : undefined
            const html = destination.endsWith(".html") ? destination : header ? fileFor(out, header) : undefined
            if (html && !htmlIds(html)?.has(decodeURIComponent(target.hash.slice(1))))
              problems.push(`${where}: ${node.url} — no such heading`)
          }
        }
      }
      for (const child of node.children ?? []) visit(child)
    }
    visit(fromMarkdown(readFileSync(file, "utf8")) as MarkdownNode)
  }
  return [...new Set(problems)]
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = join(dirname(fileURLToPath(import.meta.url)), "..", "out")
  const site = JSON.parse(readFileSync(join(out, "..", "site.config.json"), "utf8")) as { url: string }
  const problems = [...linkProblems(out, site.url), ...markdownLinkProblems(out, site.url)]
  for (const problem of problems) console.error(problem)
  if (problems.length > 0) process.exit(1)
  console.log("links: ok")
}
