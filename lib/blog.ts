import { rehypeCodeDefaultOptions } from "fumadocs-core/mdx-plugins"
import { applyMdxPreset } from "fumadocs-mdx/config"
import { defineCollections } from "fumadocs-mdx/macro"
import { type BlogLocale, blogFrontmatterSchema, blogLocales, blogTags } from "./blog-schema"
import { rehypeCodeAccessibility } from "./rehype-code-accessibility"
import { remarkBlogCover, remarkBlogFigures } from "./remark-blog-cover"

export { type BlogLocale, blogLocales, blogTags }

const collection = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: blogFrontmatterSchema,
  mdxOptions: applyMdxPreset({
    remarkPlugins: [remarkBlogCover, remarkBlogFigures],
    rehypePlugins: [rehypeCodeAccessibility],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
      fallbackLanguage: "text",
    },
  }),
  postprocess: { includeProcessedMarkdown: true },
})

type Entry = (typeof collection.entries)[number]
type CoverImage = { src: string; width: number; height: number }

export type BlogPost = Omit<Entry, "cover"> & {
  slug: string
  lang: BlogLocale
  url: string
  coverImage?: CoverImage
  minutes: number
}

// Production builds publish only finished posts; `next dev` and BLOG_DRAFTS=1 show drafts too.
export const showDrafts = process.env.NODE_ENV !== "production" || process.env.BLOG_DRAFTS === "1"

export const blogPath = (lang: string, ...rest: string[]) => [`/${lang}/blog`, ...rest].join("/")
export const blogMarkdownPath = (lang: string, slug?: string) =>
  ["/llms.mdx/blog", lang, ...(slug ? [slug] : []), "content.md"].join("/")
export const blogSocialImage = (post: Pick<BlogPost, "lang" | "slug">) => `/og/blog-${post.lang}-${post.slug}.png`

const wordsPerMinute = 200

const all: BlogPost[] = collection.entries
  .map((entry) => {
    const match = /^([a-z0-9-]+)\/index(?:\.(ru|es))?\.mdx?$/.exec(entry.info.path.replaceAll("\\", "/"))
    if (!match)
      throw new Error(`content/blog/${entry.info.path}: posts are <slug>/index.md, index.ru.md or index.es.md`)
    const [, slug, lang = "en"] = match
    if (slug === "tags") throw new Error("content/blog/tags: that name is the topic route; pick another slug")
    const words = entry.structuredData.contents.reduce(
      (total, block) => total + block.content.split(/\s+/).filter(Boolean).length,
      0,
    )
    const cover = entry._exports.cover as CoverImage | string | undefined
    return {
      ...entry,
      slug,
      lang: lang as BlogLocale,
      url: blogPath(lang, slug),
      coverImage: typeof cover === "string" ? { src: cover, width: 1600, height: 900 } : cover,
      minutes: Math.max(1, Math.round(words / wordsPerMinute)),
    }
  })
  .toSorted((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))

const visible = all.filter((post) => showDrafts || !post.draft)

export const blogPosts = (lang: string) => visible.filter((post) => post.lang === lang)
export const blogPost = (lang: string, slug: string) => visible.find((post) => post.lang === lang && post.slug === slug)
export const blogPostLocales = (slug: string) =>
  blogLocales.filter((lang) => visible.some((post) => post.slug === slug && post.lang === lang))

export const blogTag = (id: string) => blogTags.find((tag) => tag.id === id)
/** Tags with at least one visible post in that language, in registry order. */
export const blogTagsIn = (lang: string) =>
  blogTags.filter((tag) => blogPosts(lang).some((post) => post.tags.includes(tag.id)))
export const blogTagLocales = (id: string) =>
  blogLocales.filter((lang) => blogPosts(lang).some((post) => post.tags.includes(id)))

/** Every blog page that exists, so the language menu can avoid sending a reader to a missing translation. */
export const blogPaths = () =>
  blogLocales.flatMap((lang) => [
    blogPath(lang),
    ...blogPosts(lang).map((post) => post.url),
    ...blogTagsIn(lang).map((tag) => blogPath(lang, "tags", tag.id)),
  ])

export async function blogPostMarkdown(post: BlogPost, origin: string) {
  // Processed Markdown keeps heading ids as `[#id]` and links relative to the page; agents read it out of context.
  const body = (await post.getText("processed"))
    .replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "")
    .replace(/^(#{1,6} .*?) \[#[^\]\s]+\]$/gm, "$1")
    .replace(/\]\((<?)\/(?!\/)/g, `]($1${origin}/`)
    .trim()
  const tags = post.tags.map((id) => blogTag(id)?.label[post.lang] ?? id).join(", ")
  const head = [
    `# ${post.title} (${origin}${post.url})`,
    "",
    `> ${post.description}`,
    "",
    `${post.date}${post.updated ? ` (updated ${post.updated})` : ""} · ${tags}`,
    ...(post.coverImage ? ["", `![${post.coverAlt ?? ""}](${origin}${post.coverImage.src})`] : []),
  ]
  return `${[...head, "", body].join("\n")}\n`
}
