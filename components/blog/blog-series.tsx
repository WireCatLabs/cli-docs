import { ChevronDown, Layers } from "lucide-react"
import Link from "next/link"
import { type BlogLocale, type BlogPost, blogSeriesOf } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"

/** "Series · Part 1 of 2 ▾" in the post header; opens the list of parts. */
export function SeriesSwitcher({ lang, post }: { lang: string; post: BlogPost }) {
  const found = blogSeriesOf(post)
  if (!found || found.parts.length < 2) return null
  const words = blogWords(lang)
  const { series, parts, index } = found
  return (
    <details className="blog-series-switcher">
      <summary>
        <Layers aria-hidden="true" />
        <span>
          {series.title[lang as BlogLocale]} · {words.part(index + 1, parts.length)}
        </span>
        <ChevronDown aria-hidden="true" />
      </summary>
      <SeriesParts lang={lang} parts={parts} current={post.slug} />
    </details>
  )
}

/** The series box in the post sidebar: every part, this one marked. */
export function SeriesBox({ lang, post }: { lang: string; post: BlogPost }) {
  const found = blogSeriesOf(post)
  if (!found || found.parts.length < 2) return null
  const words = blogWords(lang)
  return (
    <section className="blog-series-box" aria-label={words.inSeries}>
      <p className="blog-kicker">
        {words.inSeries} · {words.part(found.index + 1, found.parts.length)}
      </p>
      <p className="blog-series-title">{found.series.title[lang as BlogLocale]}</p>
      <SeriesParts lang={lang} parts={found.parts} current={post.slug} />
    </section>
  )
}

function SeriesParts({ lang, parts, current }: { lang: string; parts: BlogPost[]; current?: string }) {
  return (
    <ol className="blog-series-parts">
      {parts.map((part) => (
        <li key={part.slug}>
          {part.slug === current ? (
            <span aria-current="page">{part.title}</span>
          ) : (
            <Link href={part.url} hrefLang={lang}>
              {part.title}
            </Link>
          )}
        </li>
      ))}
    </ol>
  )
}

/** Series on the index: one block per series with its parts in order. */
export function SeriesShelf({ lang, posts }: { lang: string; posts: BlogPost[] }) {
  const words = blogWords(lang)
  const seen = new Set<string>()
  const shelves = posts.flatMap((post) => {
    const found = blogSeriesOf(post)
    if (!found || found.parts.length < 2 || seen.has(found.series.id)) return []
    seen.add(found.series.id)
    return [found]
  })
  if (!shelves.length) return null
  return (
    <section className="blog-series-shelf" aria-label={words.series}>
      {shelves.map(({ series, parts }) => (
        <div key={series.id}>
          <p className="blog-kicker">
            <Layers aria-hidden="true" />
            {words.series}
          </p>
          <h2>{series.title[lang as BlogLocale]}</h2>
          <ol>
            {parts.map((part, index) => (
              <li key={part.slug}>
                <Link href={part.url}>
                  <span className="blog-series-number">{words.part(index + 1, parts.length)}</span>
                  <span>{part.title}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  )
}
