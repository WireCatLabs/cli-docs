import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page"
import { TOC, TOCProvider } from "fumadocs-ui/layouts/docs/page/slots/toc"
import { createRelativeLink } from "fumadocs-ui/mdx"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CommandReferenceIndex } from "@/components/command-reference-index"
import { DocsContentsHint } from "@/components/docs-contents-hint"
import { DocsDisclosures } from "@/components/docs-disclosures"
import { DocsTocPopover } from "@/components/docs-toc-popover"
import { getMDXComponents } from "@/components/mdx"
import { ReaderGuide } from "@/components/reader-guide"
import { StructuredData } from "@/components/structured-data"
import { installationReferenceTitle, ToolInstallationIntro } from "@/components/tool-installation-intro"
import { guideOrientation, guideStartLink } from "@/lib/guide-orientation"
import { readerGuide } from "@/lib/reader-guides"
import { commandReferences } from "@/lib/remark-doc-usability"
import {
  documentationDescription,
  documentationTitle,
  pageMetadata,
  pageStructuredData,
  seoLocales,
  seoWords,
} from "@/lib/seo"
import { appName, getPageMarkdownUrl, toolOf } from "@/lib/shared"
import { homePath } from "@/lib/site-routes"
import { source } from "@/lib/source"
import { wordsFor } from "@/lib/words"
import "@/lib/docs-usability.css"

type Props = { params: Promise<{ lang: string; slug?: string[] }> }

export default async function Page(props: Props) {
  const { slug, lang } = await props.params
  const page = source.getPage(slug, lang)
  if (!page) notFound()

  const MDX = page.data.body
  const markdownUrl = getPageMarkdownUrl(page).url
  const tool = toolOf(page.slugs)
  const description = documentationDescription(lang, page.slugs, page.data.description)
  const breadcrumbs = [
    { name: seoWords(lang).homeLabel, pathname: homePath(lang) },
    { name: seoWords(lang).docsLabel, pathname: `/${lang}/docs` },
    ...(tool ? [{ name: tool.name === "tg" ? "Telegram" : "MAX", pathname: `/${lang}/docs/${tool.name}` }] : []),
    ...(page.slugs.length > (tool ? 1 : 0)
      ? [{ name: readerGuide(page.slugs, lang)?.title ?? page.data.title, pathname: page.url }]
      : []),
  ]
  const written = page.data.contentLanguage ?? tool?.lang ?? lang
  const ui = wordsFor(lang).navigation
  const guide =
    tool && page.slugs.at(-1) === "installation"
      ? "installation"
      : tool && page.slugs.at(-1) === "mcp"
        ? "mcp"
        : undefined
  const repoPath =
    page.slugs.at(-1) === "changelog"
      ? "CHANGELOG.md"
      : page.slugs.at(-1)?.startsWith("commands-")
        ? "docs/commands.md"
        : `docs/${page.slugs.slice(1).join("/") || "index"}.md`

  const commandIndex = tool && page.slugs.at(-1) === "commands"
  const commandRaw = commandIndex ? await page.data.getText("raw") : ""
  const commandNames = [...commandReferences(commandRaw)]
  const commandAliases = [
    ...new Set([
      ...page.data.toc.map((item) => decodeURIComponent(item.url.slice(1))),
      ...[...commandRaw.matchAll(/<a id="([^"<>]+)"\s*\/>/g)].map((match) => match[1]),
    ]),
  ]
  const taskGuide = readerGuide(page.slugs, lang)
  const toc = taskGuide
    ? [
        ...(taskGuide.setup ? [{ title: taskGuide.setup.title, url: "#task-bot-connect", depth: 2 }] : []),
        ...taskGuide.sections.map((section) => ({ title: section.title, url: `#${section.id}`, depth: 2 })),
        ...(taskGuide.fixture ? [{ title: taskGuide.fixture.title, url: "#task-incomplete-history", depth: 2 }] : []),
        { title: taskGuide.reference, url: "#technical-reference", depth: 2 },
        ...page.data.toc,
      ]
    : commandIndex
      ? []
      : guide === "installation"
        ? [
            { title: ui.installGuide, url: "#agent-installation", depth: 2 },
            { title: installationReferenceTitle(lang), url: "#installation-reference", depth: 2 },
            ...page.data.toc,
          ]
        : page.data.toc

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      slots={{ toc: { provider: TOCProvider, main: TOC, popover: DocsTocPopover } }}
      tableOfContent={{
        container: {
          role: "navigation",
          "aria-label": { en: "On this page", ru: "На этой странице", es: "En esta página" }[lang],
        },
      }}
      tableOfContentPopover={{
        container: {
          role: "navigation",
          "aria-label": { en: "On this page", ru: "На этой странице", es: "En esta página" }[lang],
        },
      }}
    >
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname: page.url,
          title: taskGuide?.title ?? page.data.title,
          description,
          breadcrumbs,
          tool,
        })}
      />
      <DocsDisclosures />
      <DocsTitle>{taskGuide?.title ?? page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{description}</DocsDescription>
      {(page.slugs.at(-1)?.startsWith("commands-") || page.slugs.at(-1) === "configuration") && (
        <DocsContentsHint lang={lang} />
      )}
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          {...(tool
            ? {
                githubUrl: `https://github.com/${tool.repo}/blob/${tool.guideRefs?.[page.slugs.at(-1) ?? ""] ?? tool.docsRef ?? "main"}/${repoPath}`,
              }
            : {})}
        />
      </div>
      {written !== lang && <p className="text-sm text-fd-muted-foreground">{wordsFor(lang).inLanguage(written)}</p>}
      {guide === "mcp" && (
        <Link
          href={`/${lang}/docs/mcp`}
          className="rounded-xl border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
        >
          <span className="block text-sm font-semibold">{ui.mcp} →</span>
          <span className="mt-1 block text-sm text-fd-muted-foreground">{ui.mcpGuideDescription}</span>
        </Link>
      )}
      <DocsBody lang={written}>
        {!taskGuide && guideOrientation(page.slugs, lang) && (
          <p data-guide-orientation lang={lang}>
            {guideOrientation(page.slugs, lang)}
          </p>
        )}
        {!taskGuide && guideStartLink(page.slugs, lang) && (
          <p lang={lang}>
            <Link href={guideStartLink(page.slugs, lang)?.href ?? ""}>{guideStartLink(page.slugs, lang)?.label} →</Link>
          </p>
        )}
        {guide === "installation" && tool && <ToolInstallationIntro tool={tool} lang={lang} />}
        {taskGuide ? (
          <>
            <ReaderGuide slugs={page.slugs} lang={lang} />
            <section id="technical-reference" data-technical-reference>
              <h2 lang={lang}>{taskGuide.reference}</h2>
              <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
            </section>
          </>
        ) : commandIndex && tool ? (
          <CommandReferenceIndex
            tool={tool.name}
            lang={lang}
            markdownUrl={markdownUrl}
            commands={commandNames}
            aliases={commandAliases}
          />
        ) : (
          <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
        )}
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
  const title = documentationTitle(lang, page.slugs, page.data.title)
  return pageMetadata({
    lang,
    suffix: `/docs${page.slugs.length ? `/${page.slugs.join("/")}` : ""}`,
    title: `${title} · ${appName}`,
    description: documentationDescription(lang, page.slugs, page.data.description),
    available: seoLocales.filter((locale) => source.getPage(page.slugs, locale)),
    article: true,
  })
}
