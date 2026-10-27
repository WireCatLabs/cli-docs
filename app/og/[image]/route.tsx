import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { blogLocales, blogPost, blogPosts } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { localeOf, seoLocales, seoWords } from "@/lib/seo"

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
  const [memory, context] = words.socialTitle.split(/(?<=\.) /)
  const headline = post ? (
    <span style={{ fontSize: post.title.length > 60 ? 48 : 56, lineHeight: 1.2 }}>{post.title}</span>
  ) : (
    <>
      <span>{memory}</span>
      <span style={{ color: "#b8afff" }}>{context}</span>
    </>
  )
  const fonts = [
    {
      name: "Unbounded Latin",
      data: readFileSync(join(process.cwd(), "lib/social-fonts/latin.ttf")),
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Unbounded Cyrillic",
      data: readFileSync(join(process.cwd(), "lib/social-fonts/cyrillic.ttf")),
      weight: 700 as const,
      style: "normal" as const,
    },
  ]
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 56px",
        background: "#101617",
        color: "#ffffff",
        fontFamily: "Unbounded Latin, Unbounded Cyrillic",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40 }}>
          <svg width="64" height="64" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="16" fill="#4b53f0" />
            <path d="M9 21V11l4 4 3-4 3 4 4-4v10" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
          WireCat
        </div>
        <span style={{ fontSize: 28, color: "#d3d9db" }}>wirecat.dev</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 56, lineHeight: 1.2, gap: 8 }}>{headline}</div>
      <div style={{ display: "flex", fontSize: 28, color: "#d3d9db" }}>
        {post ? `${blogWords(lang).title} · ${post.date}` : words.socialDescription}
      </div>
    </div>,
    { width: 1200, height: 630, fonts },
  )
}
