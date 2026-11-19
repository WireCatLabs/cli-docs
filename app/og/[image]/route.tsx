import { blogLocales, blogPost, blogPosts } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { localeOf, seoLocales, seoWords } from "@/lib/seo"
import { socialCard } from "@/lib/social-card"

export const dynamic = "force-static"

export function generateStaticParams() {
  return [
    ...seoLocales.map((lang) => ({ image: `${lang}.png` })),
    ...blogLocales.flatMap((lang) => blogPosts(lang).map((post) => ({ image: `blog-${lang}-${post.slug}.png` }))),
  ]
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params
  const [, postLang, slug] = /^blog-(en|ru|es)-(.+)\.png$/.exec(image) ?? []
  const post = postLang && slug ? blogPost(postLang, slug) : undefined
  const lang = localeOf(post ? post.lang : image.replace(/\.png$/, ""))
  const words = seoWords(lang)
  const [memory, context] = words.socialTitle.split(/(?<=[.—]) /)
  const headline = post ? (
    <span style={{ fontSize: post.title.length > 60 ? 48 : 56, lineHeight: 1.2 }}>{post.title}</span>
  ) : (
    [
      <span key="memory">{memory}</span>,
      <span key="context" style={{ fontSize: 44, color: "#b8afff" }}>
        {context}
      </span>,
    ]
  )
  return socialCard({ headline, footer: post ? `${blogWords(lang).title} · ${post.date}` : words.socialDescription })
}
