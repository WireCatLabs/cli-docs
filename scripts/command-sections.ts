import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { commandGroups, splitCommandReference } from "../lib/command-groups.ts"
export function writeCommandSections(root: string) {
  for (const tool of ["tg", "max"])
    for (const lang of ["en", "ru", "es"]) {
      const suffix = lang === "en" ? "" : `.${lang}`
      const path = join(root, "content/docs", tool, `commands${suffix}.md`)
      if (!existsSync(path)) continue
      const markdown = readFileSync(path, "utf8")
      if (!/^#{2,3} `(?:tg|max) /m.test(markdown)) continue
      const parts = splitCommandReference(markdown, lang)
      for (const group of commandGroups)
        writeFileSync(join(root, "content/docs", tool, `commands-${group}${suffix}.md`), parts[group])
    }
}
