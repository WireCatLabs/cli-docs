import { notFound } from "next/navigation"
import { blogMarkdownPath, blogPost, blogPostMarkdown, blogPosts } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { i18n } from "@/lib/i18n"
import { siteUrl } from "@/lib/shared"

export const revalidate = false

const markdown = (text: string) => new Response(text, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })

/** `/llms.mdx/blog/{lang}/content.md` lists the posts; `/llms.mdx/blog/{lang}/{slug}/content.md` is one post. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const [lang = "", ...rest] = (await params).slug ?? []
  if (!i18n.languages.some((code) => code === lang) || rest.at(-1) !== "content.md") notFound()
  const slug = rest.slice(0, -1)
  if (slug.length === 1) {
    const post = blogPost(lang, slug[0])
    if (!post) notFound()
    return markdown(await blogPostMarkdown(post, siteUrl))
  }
  if (slug.length) notFound()
  const words = blogWords(lang)
  const posts = blogPosts(lang)
  const list = posts.map(
    (post) => `- [${post.title}](${siteUrl}${blogMarkdownPath(lang, post.slug)}) (${post.date}): ${post.description}`,
  )
  return markdown(
    `${[`# WireCat ${words.title} (${siteUrl}/${lang}/blog)`, "", `> ${words.description}`, "", ...(list.length ? list : [words.empty])].join("\n")}\n`,
  )
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) => [
    { slug: [lang, "content.md"] },
    ...blogPosts(lang).map((post) => ({ slug: [lang, post.slug, "content.md"] })),
  ])
}
