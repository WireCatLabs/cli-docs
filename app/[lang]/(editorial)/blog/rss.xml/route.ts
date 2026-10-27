import { blogPath, blogPosts, blogTag } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { i18n } from "@/lib/i18n"
import { siteUrl } from "@/lib/shared"

export const dynamic = "force-static"

const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c] ?? c)
const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString()

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const words = blogWords(lang)
  const posts = blogPosts(lang).filter((post) => !post.draft)
  const items = posts.map((post) => {
    const link = `${siteUrl}${post.url}`
    return [
      "<item>",
      `<title>${escapeXml(post.title)}</title>`,
      `<link>${link}</link>`,
      `<guid isPermaLink="true">${link}</guid>`,
      `<pubDate>${rfc822(post.date)}</pubDate>`,
      `<description>${escapeXml(post.description)}</description>`,
      ...post.tags.map((id) => `<category>${escapeXml(blogTag(id)?.label[lang as "en"] ?? id)}</category>`),
      "</item>",
    ].join("")
  })
  const self = `${siteUrl}${blogPath(lang, "rss.xml")}`
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>WireCat · ${escapeXml(words.title)}</title>`,
    `<link>${siteUrl}${blogPath(lang)}</link>`,
    `<atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    `<description>${escapeXml(words.description)}</description>`,
    `<language>${lang}</language>`,
    ...(posts[0] ? [`<lastBuildDate>${rfc822(posts[0].updated ?? posts[0].date)}</lastBuildDate>`] : []),
    ...items,
    "</channel>",
    "</rss>",
  ].join("\n")
  return new Response(`${xml}\n`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }))
}
