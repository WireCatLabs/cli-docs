import { ArrowRight, FileText, Rss } from "lucide-react"
import Link from "next/link"
import { type BlogPost, blogMarkdownPath, blogPath, blogTagsIn } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { BlogMeta, BlogTags } from "./blog-meta"

export function BlogList({
  lang,
  title,
  intro,
  activeTag,
  posts,
}: {
  lang: string
  title: string
  intro: string
  activeTag?: string
  posts: BlogPost[]
}) {
  const words = blogWords(lang)
  const topics = blogTagsIn(lang)
  return (
    <div className="wirecat-blog">
      <main id="main" className="wrap blog-page">
        <header className="blog-intro">
          <h1>{title}</h1>
          <p className="intro">{intro}</p>
          <div className="blog-feeds">
            <a className="animated-text-link text-link" href={blogPath(lang, "rss.xml")}>
              <Rss aria-hidden="true" />
              <span className="link-label">{words.rss}</span>
            </a>
            <a className="animated-text-link text-link" href={blogMarkdownPath(lang)}>
              <FileText aria-hidden="true" />
              <span className="link-label">{words.markdown}</span>
            </a>
          </div>
        </header>
        {topics.length > 0 && (
          <nav className="blog-topics" aria-label={words.tags}>
            <Link href={blogPath(lang)} aria-current={activeTag ? undefined : "page"}>
              {words.all}
            </Link>
            {topics.map((tag) => (
              <Link
                key={tag.id}
                href={blogPath(lang, "tags", tag.id)}
                aria-current={activeTag === tag.id ? "page" : undefined}
              >
                {tag.label[lang as keyof typeof tag.label]}
              </Link>
            ))}
          </nav>
        )}
        {posts.length ? (
          <ol className="blog-list">
            {posts.map((post) => (
              <li key={post.url} className={post.coverImage ? "has-cover" : undefined}>
                <article aria-labelledby={`post-${post.slug}`}>
                  <BlogMeta lang={lang} post={post} />
                  <h2 id={`post-${post.slug}`}>
                    <Link href={post.url}>{post.title}</Link>
                  </h2>
                  <p>{post.description}</p>
                  <BlogTags lang={lang} tags={post.tags} />
                </article>
                {post.coverImage && (
                  // biome-ignore lint/performance/noImgElement: The static export has no image optimisation server.
                  <img
                    src={post.coverImage.src}
                    width={post.coverImage.width}
                    height={post.coverImage.height}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </li>
            ))}
          </ol>
        ) : (
          <section className="blog-empty" aria-label={words.all}>
            <p>{words.empty}</p>
            <a className="animated-text-link text-link" href={blogPath(lang, "rss.xml")}>
              <span className="link-label">{words.rss}</span>
              <ArrowRight aria-hidden="true" />
            </a>
          </section>
        )}
      </main>
    </div>
  )
}
