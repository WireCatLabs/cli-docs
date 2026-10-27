import Link from "next/link"
import { type BlogPost, blogPath, blogTag } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"

const formatDate = (lang: string, date: string) =>
  new Intl.DateTimeFormat({ en: "en-GB", ru: "ru-RU", es: "es-ES" }[lang] ?? "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))

export function BlogMeta({ lang, post }: { lang: string; post: BlogPost }) {
  const words = blogWords(lang)
  return (
    <p className="blog-meta">
      <time dateTime={post.date}>{formatDate(lang, post.date)}</time>
      <span aria-hidden="true">·</span>
      <span>{words.minutes(post.minutes)}</span>
      {post.updated && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            {words.updated} <time dateTime={post.updated}>{formatDate(lang, post.updated)}</time>
          </span>
        </>
      )}
      {post.draft && <span className="blog-draft">{words.draft}</span>}
    </p>
  )
}

export function BlogTags({ lang, tags }: { lang: string; tags: string[] }) {
  return (
    <ul className="blog-tags" aria-label={blogWords(lang).tags}>
      {tags.map((id) => (
        <li key={id}>
          <Link href={blogPath(lang, "tags", id)}>{blogTag(id)?.label[lang as "en" | "ru" | "es"] ?? id}</Link>
        </li>
      ))}
    </ul>
  )
}
