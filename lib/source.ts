import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins"
import { llms, loader } from "fumadocs-core/source"
import { metaSchema, pageSchema } from "fumadocs-core/source/schema"
import { applyMdxPreset } from "fumadocs-mdx/config"
import { defineDocs } from "fumadocs-mdx/macro"
import { dedentDocComponents, expandDocTerms } from "./doc-terms-markdown"
import { guideOrientation, guideStartLink } from "./guide-orientation"
import { i18n } from "./i18n"
import { installationMarkdown } from "./installation-markdown"
import { resolveDocumentationLink, rewriteMarkdownLinks } from "./markdown-links"
import { meetingMarkdown } from "./meeting-guide"
import { readerGuide, readerGuideMarkdown } from "./reader-guides"
import { rehypeCodeAccessibility } from "./rehype-code-accessibility"
import { remarkAnchorAliases } from "./remark-anchor-aliases"
import { remarkDocUsability } from "./remark-doc-usability"
import { remarkMermaid } from "./remark-mermaid"
import { docsRoute, getPageMarkdownUrl, siteUrl, toolOf } from "./shared"

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({ contentLanguage: pageSchema.shape.title.optional() }),
    // The tools' pages use fences Shiki has no grammar for (`cron`); those show as plain text.
    mdxOptions: applyMdxPreset({
      remarkPlugins: [remarkAnchorAliases, remarkDocUsability, remarkMermaid],
      remarkImageOptions: { useImport: false },
      rehypePlugins: [rehypeCodeAccessibility],
      rehypeCodeOptions: {
        ...rehypeCodeDefaultOptions,
        themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
        fallbackLanguage: "text",
      },
    }),
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
})

export const source = loader({
  i18n,
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [],
})

const markdownUrls = new Map(
  i18n.languages.flatMap((lang) =>
    source.getPages(lang).map((page) => [page.url, getPageMarkdownUrl(page).url] as const),
  ),
)

export const docsLlms = llms(source, {
  renderPage: async (page) => {
    const tool = toolOf(page.slugs)
    // Processed MDX indents nested tabs as code. Expand the authored installation guide instead,
    // preserving runnable fences and making every messenger/OS branch readable to agents.
    const raw = await page.data.getText("raw")
    const text =
      /^```mermaid\b/m.test(raw) ||
      /<MeetingGuide\b/.test(raw) ||
      (page.slugs.length === 1 && ["installation", "memo", "email"].includes(page.slugs[0]))
        ? raw
        : dedentDocComponents(await page.data.getText("processed"))
    const body =
      readerGuideMarkdown(page.slugs, page.locale ?? i18n.defaultLanguage) +
      (!readerGuideMarkdown(page.slugs, page.locale ?? i18n.defaultLanguage) &&
      guideOrientation(page.slugs, page.locale ?? i18n.defaultLanguage)
        ? `${guideOrientation(page.slugs, page.locale ?? i18n.defaultLanguage)}\n\n`
        : "") +
      (guideStartLink(page.slugs, page.locale ?? i18n.defaultLanguage)
        ? `[${guideStartLink(page.slugs, page.locale ?? i18n.defaultLanguage)?.label}](${guideStartLink(page.slugs, page.locale ?? i18n.defaultLanguage)?.href})\n\n`
        : "") +
      text
        .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
        .replace("<InstallationGuide />", installationMarkdown(page.locale ?? i18n.defaultLanguage))
        .replace(/<MeetingGuide\s+lang="(?:en|ru|es)"\s*\/>/, meetingMarkdown(page.locale ?? i18n.defaultLanguage))
    const markdown = rewriteMarkdownLinks(expandDocTerms(body, page.locale ?? i18n.defaultLanguage), (href) =>
      resolveDocumentationLink(
        href,
        page.slugs.length === 0 || (tool && page.slugs.length === 1) ? `${page.url}/` : page.url,
        siteUrl,
        (pathname) => markdownUrls.get(pathname),
      ),
    )
    return `# ${readerGuide(page.slugs, page.locale ?? i18n.defaultLanguage)?.title ?? page.data.title} (${page.url})\n\n${markdown}`
  },
})
