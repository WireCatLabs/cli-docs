import { notFound } from "next/navigation"
import { docsSlugsOfImage, docsSocialImageSlug, documentationDescription, seoWords, toolLabel } from "@/lib/seo"
import { serviceLogos } from "@/lib/service-logos"
import { tools } from "@/lib/shared"
import { logoDataUrl, shorten, socialCard } from "@/lib/social-card"
import { source } from "@/lib/source"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams("slug", "lang").map(({ lang, slug = [] }) => ({ lang, slug: docsSocialImageSlug(slug) }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params
  const page = source.getPage(docsSlugsOfImage(slug), lang)
  if (!page) notFound()
  const tool = tools.find((candidate) => candidate.name === page.slugs[0])
  const logo = tool && serviceLogos[tool.name]
  const title = page.data.title
  return socialCard({
    kicker: {
      label: tool ? toolLabel(lang, tool.name) : seoWords(lang).docsLabel,
      logo: logo ? logoDataUrl(logo) : undefined,
    },
    headline: <span style={{ fontSize: title.length > 60 ? 44 : title.length > 32 ? 52 : 64 }}>{title}</span>,
    footer: shorten(documentationDescription(lang, page.slugs, page.data.description), 150),
  })
}
