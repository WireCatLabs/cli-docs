import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins"
import { llms, loader } from "fumadocs-core/source"
import { metaSchema, pageSchema } from "fumadocs-core/source/schema"
import { applyMdxPreset } from "fumadocs-mdx/config"
import { defineDocs } from "fumadocs-mdx/macro"
import { expandDocTerms } from "./doc-terms-markdown"
import { i18n } from "./i18n"
import { installationMarkdown } from "./installation-markdown"
import { resolveDocumentationLink, rewriteMarkdownLinks } from "./markdown-links"
import { rehypeCodeAccessibility } from "./rehype-code-accessibility"
import { remarkAnchorAliases } from "./remark-anchor-aliases"
import { remarkDocUsability } from "./remark-doc-usability"
import { docsRoute, getPageMarkdownUrl, siteUrl, toolOf } from "./shared"

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({ contentLanguage: pageSchema.shape.title.optional() }),
    // The tools' pages use fences Shiki has no grammar for (`cron`); those show as plain text.
    mdxOptions: applyMdxPreset({
      remarkPlugins: [remarkAnchorAliases, remarkDocUsability],
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
    // Processed MDX indents nested tabs as code. Expand authored setup guides instead,
    // preserving runnable fences, explanations and every OS branch for agents.
    const text = await page.data.getText(
      page.slugs.length === 1 && ["installation", "memo", "email"].includes(page.slugs[0]) ? "raw" : "processed",
    )
    const body = text
      .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
      .replace("<InstallationGuide />", installationMarkdown(page.locale ?? i18n.defaultLanguage))
    const markdown = rewriteMarkdownLinks(expandDocTerms(body, page.locale ?? i18n.defaultLanguage), (href) =>
      resolveDocumentationLink(
        href,
        page.slugs.length === 0 || (tool && page.slugs.length === 1) ? `${page.url}/` : page.url,
        siteUrl,
        (pathname) => markdownUrls.get(pathname),
      ),
    )
    return `# ${page.data.title} (${page.url})\n\n${markdown}`
  },
})
