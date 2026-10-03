import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page"
import { createRelativeLink } from "fumadocs-ui/mdx"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMDXComponents } from "@/components/mdx"
import { appName, getPageMarkdownUrl, toolOf } from "@/lib/shared"
import { source } from "@/lib/source"
import { wordsFor } from "@/lib/words"

type Props = { params: Promise<{ lang: string; slug?: string[] }> }

export default async function Page(props: Props) {
  const { slug, lang } = await props.params
  const page = source.getPage(slug, lang)
  if (!page) notFound()

  const MDX = page.data.body
  const markdownUrl = getPageMarkdownUrl(page).url
  const tool = toolOf(page.slugs)
  const written = page.data.contentLanguage ?? tool?.lang ?? lang
  const ui = wordsFor(lang).navigation
  const guide =
    tool && page.slugs.at(-1) === "installation"
      ? "installation"
      : tool && page.slugs.at(-1) === "mcp"
        ? "mcp"
        : undefined
  const repoPath =
    page.slugs.at(-1) === "changelog" ? "CHANGELOG.md" : `docs/${page.slugs.slice(1).join("/") || "index"}.md`

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          {...(tool
            ? {
                githubUrl: `https://github.com/${tool.repo}/blob/main/${repoPath}`,
              }
            : {})}
        />
      </div>
      {written !== lang && <p className="text-sm text-fd-muted-foreground">{wordsFor(lang).inLanguage(written)}</p>}
      {guide && (
        <Link
          href={`/${lang}/docs/${guide}${guide === "installation" ? `#${tool?.name}` : ""}`}
          className="rounded-xl border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
        >
          <span className="block text-sm font-semibold">{guide === "installation" ? ui.installGuide : ui.mcp} →</span>
          <span className="mt-1 block text-sm text-fd-muted-foreground">
            {guide === "installation" ? ui.installGuideDescription : ui.mcpGuideDescription}
          </span>
        </Link>
      )}
      <DocsBody lang={written}>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams("slug", "lang")
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug, lang } = await props.params
  const page = source.getPage(slug, lang)
  if (!page) notFound()
  const tool = toolOf(page.slugs)
  const title = tool && page.slugs.length > 1 ? `${page.data.title} — ${tool.name}` : page.data.title
  const url = page.url
  return {
    title,
    description: page.data.description,
    alternates: { canonical: url },
    openGraph: { siteName: appName, title, description: page.data.description, url, type: "article" },
  }
}
