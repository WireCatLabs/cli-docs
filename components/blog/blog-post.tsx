import { ArrowLeft, ArrowRight, Hash, MessagesSquare, Rss, Search, Sparkles } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { adjacentPosts, type BlogPost, blogPath, blogPostLocales, blogTag, relatedPosts } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import siteConfig from "@/site.config.json"
import { AuthorByline, AuthorCard } from "./blog-author"
import { PostCard } from "./blog-card"
import { BlogCode } from "./blog-code"
import { Glance } from "./blog-glance"
import { BlogLayout, BlogWidget } from "./blog-layout"
import { BlogMeta, BlogTags } from "./blog-meta"
import { BlogSearchForm } from "./blog-search"
import { SeriesBox, SeriesSwitcher } from "./blog-series"
import { ShareLinks } from "./blog-share"
import { BlogToc } from "./blog-toc"
import { FollowLinks, NewsletterBlock } from "./blog-widgets"

function Figure({ src, alt, title, width, height }: ComponentProps<"img">) {
  const image = src as unknown as string | { src: string; width: number; height: number }
  const file = typeof image === "string" ? { src: image, width, height } : image
  return (
    <figure className="blog-figure">
      {/* biome-ignore lint/performance/noImgElement: The static export has no image optimisation server. */}
      <img src={file.src} width={file.width} height={file.height} alt={alt ?? ""} loading="lazy" decoding="async" />
      {title && <figcaption>{title}</figcaption>}
    </figure>
  )
}

/** Discord for English and Spanish readers, the Telegram group for Russian ones; nothing until a URL is set. */
export function discussionLink(lang: string) {
  const words = blogWords(lang)
  const { discord, telegramGroup } = siteConfig.community
  if (lang === "ru") return telegramGroup ? { href: telegramGroup, label: words.telegram } : undefined
  return discord ? { href: discord, label: words.discord } : undefined
}

export function BlogPostPage({ lang, post }: { lang: string; post: BlogPost }) {
  const words = blogWords(lang)
  const Body = post.body
  const languages = blogPostLocales(post.slug)
  const discussion = discussionLink(lang)
  const contents = post.toc.filter((item) => item.depth <= 3)
  const related = relatedPosts(post)
  const { newer, older } = adjacentPosts(post)
  const topic = blogTag(post.tags[0])
  const aside = (
    <>
      <BlogWidget title={words.search} icon={<Search aria-hidden="true" />}>
        <BlogSearchForm lang={lang} />
      </BlogWidget>
      <SeriesBox lang={lang} post={post} />
      {related.length > 0 && (
        <BlogWidget title={words.related} icon={<Sparkles aria-hidden="true" />}>
          <ul className="blog-related">
            {related.map((other) => (
              <li key={other.slug}>
                <PostCard lang={lang} post={other} variant="compact" headingLevel={3} />
              </li>
            ))}
          </ul>
        </BlogWidget>
      )}
      <BlogWidget title={words.tags} icon={<Hash aria-hidden="true" />}>
        <BlogTags lang={lang} tags={post.tags} />
      </BlogWidget>
      <BlogWidget title={words.follow} icon={<Rss aria-hidden="true" />}>
        <FollowLinks lang={lang} />
      </BlogWidget>
    </>
  )
  return (
    <BlogLayout
      className="blog-article"
      aside={aside}
      margin={<BlogToc title={words.contents} items={contents} variant="margin" />}
    >
      <nav className="blog-breadcrumb" aria-label={words.breadcrumb}>
        <ol>
          <li>
            <Link href={blogPath(lang)}>{words.title}</Link>
          </li>
          {topic && (
            <li>
              <Link href={blogPath(lang, "tags", topic.id)}>{topic.label[lang as "en" | "ru" | "es"]}</Link>
            </li>
          )}
        </ol>
      </nav>
      <header className="blog-post-head">
        <h1>{post.title}</h1>
        <p className="blog-standfirst">{post.description}</p>
        <div className="blog-post-meta">
          <AuthorByline lang={lang} id={post.author} />
          <BlogMeta lang={lang} post={post} />
          {languages.length > 1 && (
            <ul className="blog-languages" aria-label={words.translation}>
              {languages.map((locale) => (
                <li key={locale}>
                  {locale === lang ? (
                    <span aria-current="page">{locale.toUpperCase()}</span>
                  ) : (
                    <a href={blogPath(locale, post.slug)} hrefLang={locale} lang={locale}>
                      {locale.toUpperCase()}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <SeriesSwitcher lang={lang} post={post} />
      </header>
      <BlogToc title={words.contents} items={contents} variant="top" />
      <Glance lang={lang} items={post.glance} />
      {post.coverImage && (
        <figure className="blog-cover">
          {/* biome-ignore lint/performance/noImgElement: The static export has no image optimisation server. */}
          <img
            src={post.coverImage.src}
            width={post.coverImage.width}
            height={post.coverImage.height}
            alt={post.coverAlt ?? ""}
            fetchPriority="high"
          />
        </figure>
      )}
      <article className="blog-prose" lang={lang}>
        <Body components={{ pre: BlogCode, img: Figure }} />
      </article>
      <footer className="blog-post-end">
        <div className="blog-share-row">
          <span className="blog-kicker">{words.share}</span>
          <ShareLinks lang={lang} title={post.title} url={post.url} />
        </div>
        <AuthorCard lang={lang} id={post.author} />
        {(newer || older) && (
          <nav className="blog-adjacent" aria-label={`${words.previous} / ${words.next}`}>
            {older && (
              <Link href={older.url} rel="prev">
                <span className="blog-kicker">
                  <ArrowLeft aria-hidden="true" />
                  {words.previous}
                </span>
                {older.title}
              </Link>
            )}
            {newer && (
              <Link href={newer.url} rel="next" className="blog-adjacent-next">
                <span className="blog-kicker">
                  {words.next}
                  <ArrowRight aria-hidden="true" />
                </span>
                {newer.title}
              </Link>
            )}
          </nav>
        )}
        {discussion && (
          <a className="blog-action" href={discussion.href} target="_blank" rel="noopener noreferrer">
            <MessagesSquare aria-hidden="true" />
            {discussion.label}
          </a>
        )}
        <NewsletterBlock lang={lang} />
      </footer>
    </BlogLayout>
  )
}
