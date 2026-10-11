import { i18n } from "@/lib/i18n"
import { docsLlms, source } from "@/lib/source"

export const revalidate = false

// The per-group command pages split the full command reference; including them would repeat it.
const isCommandGroup = (slugs: string[]) => slugs.length === 2 && slugs[1].startsWith("commands-")

export async function GET() {
  const pages = await Promise.all(
    source
      .getPages(i18n.defaultLanguage)
      .filter((page) => !isCommandGroup(page.slugs))
      .map((page) => docsLlms.page(page)),
  )
  return new Response(pages.join("\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
