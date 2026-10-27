import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogList } from "@/components/blog/blog-list"
import { BlogPostPage } from "@/components/blog/blog-post"
import { StructuredData } from "@/components/structured-data"
import {
  blogPath,
  blogPost,
  blogPostLocales,
  blogPosts,
  blogSocialImage,
  blogTag,
  blogTagLocales,
  blogTagsIn,
} from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { i18n } from "@/lib/i18n"
import { pageMetadata, pageStructuredData, type SiteLocale, seoWords } from "@/lib/seo"
import { homePath } from "@/lib/site-routes"
import "@/components/blog/blog.css"

type Props = { params: Promise<{ lang: string; slug?: string[] }> }

type Route =
  | { kind: "index" }
  | { kind: "tag"; tag: NonNullable<ReturnType<typeof blogTag>> }
  | { kind: "post"; post: NonNullable<ReturnType<typeof blogPost>> }

function resolve(lang: string, slug: string[] = []): Route | undefined {
  if (!slug.length) return { kind: "index" }
  if (slug.length === 2 && slug[0] === "tags") {
    const tag = blogTag(slug[1])
    return tag && blogTagsIn(lang).includes(tag) ? { kind: "tag", tag } : undefined
  }
  const post = slug.length === 1 ? blogPost(lang, slug[0]) : undefined
  return post ? { kind: "post", post } : undefined
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params
  const route = resolve(lang, slug)
  const words = blogWords(lang)
  if (!route) return {}
  if (route.kind === "index")
    return pageMetadata({ lang, suffix: "/blog", title: `${words.title} · WireCat`, description: words.description })
  if (route.kind === "tag") {
    const { tag } = route
    return pageMetadata({
      lang,
      suffix: `/blog/tags/${tag.id}`,
      title: `${words.tagTitle(tag.label[lang as SiteLocale])} · WireCat`,
      description: tag.description[lang as SiteLocale],
      available: blogTagLocales(tag.id),
    })
  }
  const { post } = route
  const metadata = pageMetadata({
    lang,
    suffix: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    available: blogPostLocales(post.slug),
    socialImage: { pathname: blogSocialImage(post), alt: post.title },
    canonical: post.canonical,
    published: { date: post.date, updated: post.updated, tags: post.tags },
  })
  return {
    ...metadata,
    // Drafts render only in development; keep them out of any index that happens to see one.
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
    alternates: { ...metadata.alternates, types: { "application/rss+xml": blogPath(lang, "rss.xml") } },
  }
}

export default async function BlogPage({ params }: Props) {
  const { lang, slug } = await params
  const route = resolve(lang, slug)
  if (!route) notFound()
  const words = blogWords(lang)
  const blogCrumb = { name: words.title, pathname: blogPath(lang) }
  const home = { name: seoWords(lang).homeLabel, pathname: homePath(lang) }
  if (route.kind === "post") {
    const { post } = route
    return (
      <>
        <StructuredData
          data={pageStructuredData({
            lang,
            pathname: post.url,
            title: post.title,
            description: post.description,
            breadcrumbs: [home, blogCrumb, { name: post.title, pathname: post.url }],
            post: { date: post.date, updated: post.updated, image: blogSocialImage(post), keywords: post.tags },
          })}
        />
        <BlogPostPage lang={lang} post={post} />
      </>
    )
  }
  const tag = route.kind === "tag" ? route.tag : undefined
  const label = tag?.label[lang as SiteLocale]
  const pathname = tag ? blogPath(lang, "tags", tag.id) : blogPath(lang)
  const title = label ? words.tagTitle(label) : words.title
  const description = tag ? tag.description[lang as SiteLocale] : words.description
  return (
    <>
      <StructuredData
        data={pageStructuredData({
          lang,
          pathname,
          title,
          description,
          breadcrumbs: [home, blogCrumb, ...(tag ? [{ name: title, pathname }] : [])],
        })}
      />
      <BlogList
        lang={lang}
        title={title}
        intro={tag ? description : words.intro}
        activeTag={tag?.id}
        posts={blogPosts(lang).filter((post) => !tag || post.tags.includes(tag.id))}
      />
    </>
  )
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) => [
    { lang, slug: [] },
    ...blogPosts(lang).map((post) => ({ lang, slug: [post.slug] })),
    ...blogTagsIn(lang).map((tag) => ({ lang, slug: ["tags", tag.id] })),
  ])
}
