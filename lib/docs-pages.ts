import { readdirSync, readFileSync } from "node:fs"
import { join, relative } from "node:path"
import { parse } from "yaml"
import { i18n } from "./i18n"

export type DocsPageInfo = { lang: string; slugs: string[]; title: string; description?: string }

// Read from the files' frontmatter, not from lib/source: compiling the MDX tree for a route that only needs titles ran
// the dev server out of memory.
const root = join(process.cwd(), "content/docs")
const file = /^(.*?)(?:\.(ru|es))?\.mdx?$/
let pages: Map<string, DocsPageInfo> | undefined

const keyOf = (lang: string, slugs: string[]) => `${lang}:${slugs.join("/")}`

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)],
  )
}

function frontmatter(path: string): { title?: string; description?: string } {
  const [, yaml] = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(path, "utf8")) ?? []
  return yaml ? (parse(yaml) ?? {}) : {}
}

/** Every docs page by language, with the default language standing in where a translation is missing. */
export function docsPages(): Map<string, DocsPageInfo> {
  if (pages) return pages
  const found = new Map<string, DocsPageInfo>()
  for (const path of files(root)) {
    const [, base, lang = i18n.defaultLanguage] = file.exec(relative(root, path)) ?? []
    if (!base) continue
    const slugs = base.split("/").filter((part, index, all) => !(index === all.length - 1 && part === "index"))
    const { title, description } = frontmatter(path)
    if (title) found.set(keyOf(lang, slugs), { lang, slugs, title, description })
  }
  for (const page of [...found.values()].filter((entry) => entry.lang === i18n.defaultLanguage))
    for (const lang of i18n.languages)
      if (!found.has(keyOf(lang, page.slugs))) found.set(keyOf(lang, page.slugs), { ...page, lang })
  pages = found
  return found
}

export const docsPage = (lang: string, slugs: string[]) => docsPages().get(keyOf(lang, slugs))
