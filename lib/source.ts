import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins"
import { llms, loader } from "fumadocs-core/source"
import { metaSchema, pageSchema } from "fumadocs-core/source/schema"
import { applyMdxPreset } from "fumadocs-mdx/config"
import { defineDocs } from "fumadocs-mdx/macro"
import { i18n } from "./i18n"
import { remarkAnchorAliases } from "./remark-anchor-aliases"
import { remarkDocUsability } from "./remark-doc-usability"
import { docsRoute } from "./shared"

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema.extend({ contentLanguage: pageSchema.shape.title.optional() }),
    // The tools' pages use fences Shiki has no grammar for (`cron`); those show as plain text.
    mdxOptions: applyMdxPreset({
      remarkPlugins: [remarkAnchorAliases, remarkDocUsability],
      rehypeCodeOptions: { ...rehypeCodeDefaultOptions, fallbackLanguage: "text" },
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

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
})
