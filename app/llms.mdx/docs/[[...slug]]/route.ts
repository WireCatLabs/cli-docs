import { notFound } from "next/navigation"
import { i18n } from "@/lib/i18n"
import { getPageMarkdownUrl } from "@/lib/shared"
import { docsLlms, source } from "@/lib/source"

export const revalidate = false

export async function GET(_req: Request, { params }: RouteContext<"/llms.mdx/docs/[[...slug]]">) {
  const { slug } = await params
  const parts = slug?.slice(0, -1) ?? []
  const language = i18n.languages.find((lang) => lang === parts[0])
  if (language) parts.shift()
  const page = source.getPage(parts, language ?? i18n.defaultLanguage)
  if (!page) notFound()

  return new Response(await docsLlms.page(page), {
    headers: {
      "Content-Type": "text/markdown",
    },
  })
}

export function generateStaticParams() {
  const urls = i18n.languages.flatMap((lang) => source.getPages(lang).map((page) => getPageMarkdownUrl(page)))
  return [...new Map(urls.map((item) => [item.url, { slug: item.segments }])).values()]
}
