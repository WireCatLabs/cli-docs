import { ArrowLeft, ArrowRight, FileText, FolderGit2, MessagesSquare, Rss } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { type BlogPost, blogMarkdownPath, blogPath, blogPostLocales } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import siteConfig from "@/site.config.json"
import { BlogCode } from "./blog-code"
import { BlogMeta, BlogTags } from "./blog-meta"
import { NewsletterForm } from "./newsletter-form"

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
  const translations = blogPostLocales(post.slug).filter((locale) => locale !== lang)
  const discussion = discussionLink(lang)
  const contents = post.toc.filter((item) => item.depth <= 3)
  return (
    <div className="wirecat-blog">
      <main id="main" className="wrap blog-page blog-post">
        <header className="blog-post-head">
          <Link className="blog-back animated-text-link" href={blogPath(lang)}>
            <ArrowLeft aria-hidden="true" />
            <span className="link-label">{words.back}</span>
          </Link>
          <BlogMeta lang={lang} post={post} />
          <h1>{post.title}</h1>
          <p className="intro">{post.description}</p>
          <BlogTags lang={lang} tags={post.tags} />
        </header>
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
        <div className="blog-layout">
          <article className="blog-prose" lang={lang}>
            <Body components={{ pre: BlogCode, img: Figure }} />
          </article>
          <aside className="blog-aside" aria-label={words.contents}>
            {contents.length > 2 && (
              <nav className="blog-contents" aria-label={words.contents}>
                <p>{words.contents}</p>
                <ol>
                  {contents.map((item) => (
                    <li key={item.url} data-depth={item.depth}>
                      <a href={item.url}>{item.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="blog-aside-links">
              {translations.map((locale) => (
                <a
                  key={locale}
                  className="animated-text-link text-link"
                  href={blogPath(locale, post.slug)}
                  hrefLang={locale}
                >
                  <span className="link-label">
                    {words.translation} {words.languages[locale]}
                  </span>
                  <ArrowRight aria-hidden="true" />
                </a>
              ))}
              <a className="animated-text-link text-link" href={blogMarkdownPath(lang, post.slug)}>
                <FileText aria-hidden="true" />
                <span className="link-label">{words.markdown}</span>
              </a>
            </div>
          </aside>
        </div>
        <footer className="blog-post-end">
          {discussion && (
            <section aria-labelledby="blog-discuss">
              <h2 id="blog-discuss">{words.discussTitle}</h2>
              <a className="blog-action" href={discussion.href} target="_blank" rel="noopener noreferrer">
                <MessagesSquare aria-hidden="true" />
                {discussion.label}
              </a>
            </section>
          )}
          <section aria-labelledby="blog-follow">
            <h2 id="blog-follow">{words.follow}</h2>
            <p>{words.followText}</p>
            <div className="blog-actions">
              <a className="blog-action" href={blogPath(lang, "rss.xml")}>
                <Rss aria-hidden="true" />
                {words.rss}
              </a>
              <a className="blog-action" href={siteConfig.github} target="_blank" rel="noopener noreferrer">
                <FolderGit2 aria-hidden="true" />
                GitHub
              </a>
              <Link className="blog-action" href={`/${lang}/docs`}>
                <ArrowRight aria-hidden="true" />
                {words.docs}
              </Link>
            </div>
          </section>
          {siteConfig.newsletter.endpoint && <NewsletterForm lang={lang} endpoint={siteConfig.newsletter.endpoint} />}
        </footer>
      </main>
    </div>
  )
}
