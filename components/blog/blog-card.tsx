import Link from "next/link"
import { type BlogPost, blogTag } from "@/lib/blog"
import { BlogMeta, BlogTags } from "./blog-meta"

/**
 * A post as a card. `lead` is the large first story on the index; `compact` is the small one in sidebars and
 * "more to read". A post without a cover gets a pattern tinted by its first tag, so the grid keeps its rhythm.
 */
export function PostCard({
  lang,
  post,
  variant = "default",
  headingLevel = 2,
}: {
  lang: string
  post: BlogPost
  variant?: "lead" | "default" | "compact"
  headingLevel?: 2 | 3
}) {
  const Heading = `h${headingLevel}` as const
  const topic = blogTag(post.tags[0])?.label[lang as "en" | "ru" | "es"]
  return (
    <article className={`blog-card blog-card-${variant}`} aria-labelledby={`card-${variant}-${post.slug}`}>
      <Link href={post.url} className="blog-card-media" tabIndex={-1} aria-hidden="true">
        {post.coverImage ? (
          // biome-ignore lint/performance/noImgElement: The static export has no image optimisation server.
          <img
            src={post.coverImage.src}
            width={post.coverImage.width}
            height={post.coverImage.height}
            alt=""
            loading={variant === "lead" ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <span className="blog-card-pattern" data-topic={post.tags[0]}>
            {topic}
          </span>
        )}
      </Link>
      <div className="blog-card-body">
        <Heading id={`card-${variant}-${post.slug}`}>
          <Link href={post.url}>{post.title}</Link>
        </Heading>
        {variant !== "compact" && <p className="blog-card-text">{post.description}</p>}
        <BlogMeta lang={lang} post={post} month={variant === "lead" ? "long" : "short"} />
        {variant !== "compact" && <BlogTags lang={lang} tags={post.tags} />}
      </div>
    </article>
  )
}
