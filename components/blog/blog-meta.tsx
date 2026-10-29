import Link from "next/link"
import { type BlogPost, blogPath, blogTag } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"

const locales = { en: "en-GB", ru: "ru-RU", es: "es-ES" } as const

export const formatDate = (lang: string, date: string, month: "long" | "short" = "long") =>
  new Intl.DateTimeFormat(locales[lang as keyof typeof locales] ?? "en-GB", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))

export const formatMonth = (lang: string, month: string) =>
  new Intl.DateTimeFormat(locales[lang as keyof typeof locales] ?? "en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00Z`))

/** Date and reading time; "Updated" only when the front matter says so. */
export function BlogMeta({ lang, post, month = "long" }: { lang: string; post: BlogPost; month?: "long" | "short" }) {
  const words = blogWords(lang)
  return (
    <p className="blog-meta">
      <time dateTime={post.date}>{formatDate(lang, post.date, month)}</time>
      <span aria-hidden="true">·</span>
      <span>{words.minutes(post.minutes)}</span>
      {post.updated && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            {words.updated} <time dateTime={post.updated}>{formatDate(lang, post.updated, month)}</time>
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
