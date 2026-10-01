import { i18n } from "@/lib/i18n"
import { docsLlms, source } from "@/lib/source"

export const revalidate = false

export async function GET() {
  const pages = await Promise.all(source.getPages(i18n.defaultLanguage).map((page) => docsLlms.page(page)))
  return new Response(pages.join("\n\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
