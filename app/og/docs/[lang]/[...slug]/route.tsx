import { notFound } from "next/navigation"
import { docsPage, docsPages } from "@/lib/docs-pages"
import { docsSlugsOfImage, docsSocialImageSlug, documentationDescription, toolLabel } from "@/lib/seo"
import { serviceLogos } from "@/lib/service-logos"
import { tools } from "@/lib/shared"
import { logoDataUrl, pageCard } from "@/lib/social-card"

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
  // A tool's own index is titled with the tool, so only its pages name the tool above the title.
  return pageCard({
    title: page.title,
    description: documentationDescription(lang, page.slugs, page.description),
    logo: logo ? logoDataUrl(logo) : undefined,
    label: tool && page.slugs.length > 1 ? toolLabel(lang, tool.name) : undefined,
  })
}
