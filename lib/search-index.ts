import { createFromSource } from "fumadocs-core/search/server"
import { blogLocales, blogPosts } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { searchIntentPhrases } from "@/lib/search-intents"
import { source } from "@/lib/source"

type Page = ReturnType<typeof source.getPages>[number]

/** Published posts shaped like docs pages, so they join the same per-language index under the "blog" tag. */
const blogPages = (lang?: string) =>
  blogLocales
    .filter((locale) => !lang || locale === lang)
    .flatMap((locale) =>
      blogPosts(locale)
        .filter((post) => !post.draft)
        .map((post) => ({ url: post.url, locale, slugs: [], data: post }) as unknown as Page),
    )
const isBlog = (page: Page) => page.url.startsWith(`/${page.locale}/blog/`)

/** The whole static search index, every language in one export. */
export const searchIndex = createFromSource(
  { ...source, getPages: (lang?: string) => [...source.getPages(lang), ...blogPages(lang)] },
  {
    localeMap: { en: "english", ru: "russian", es: "spanish" },
    buildIndex: (page) => {
      const structuredData = page.data.structuredData
      if (!structuredData) throw new Error(`Missing search content: ${page.url}`)
      const blog = isBlog(page)
      return {
        id: page.url,
        url: page.url,
        title: page.data.title,
        description: page.data.description,
        tag: blog ? "blog" : "docs",
        ...(blog ? { breadcrumbs: [blogWords(page.locale ?? "en").title] } : {}),
        structuredData: {
          ...structuredData,
          contents: [
            ...structuredData.contents,
            ...(blog ? [] : searchIntentPhrases(page.slugs, page.locale)).map((content) => ({
              heading: undefined,
              content,
            })),
          ],
        },
      }
    },
  },
)
