import { notFound } from "next/navigation"
import { docsPage, docsPages } from "@/lib/docs-pages"
import { docsSlugsOfImage, docsSocialImageSlug, documentationDescription, seoWords, toolLabel } from "@/lib/seo"
import { serviceLogos } from "@/lib/service-logos"
import { tools } from "@/lib/shared"
import { logoDataUrl, shorten, socialCard } from "@/lib/social-card"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return [...docsPages().values()].map(({ lang, slugs }) => ({ lang, slug: docsSocialImageSlug(slugs) }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; slug: string[] }> }) {
  const { lang, slug } = await params
  const page = docsPage(lang, docsSlugsOfImage(slug))
  if (!page) notFound()
  const tool = tools.find((candidate) => candidate.name === page.slugs[0])
  const logo = tool && serviceLogos[tool.name]
  return socialCard({
    kicker: {
      // A tool's own index is titled with the tool, so its label names the docs instead of repeating it.
      label: tool && page.slugs.length > 1 ? toolLabel(lang, tool.name) : seoWords(lang).docsLabel,
      logo: logo ? logoDataUrl(logo) : undefined,
    },
    headline: (
      <span style={{ fontSize: page.title.length > 60 ? 44 : page.title.length > 32 ? 52 : 64 }}>{page.title}</span>
    ),
    footer: shorten(documentationDescription(lang, page.slugs, page.description), 150),
  })
}
