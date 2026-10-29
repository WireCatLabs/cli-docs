import { ChevronDown, Tags } from "lucide-react"
import Link from "next/link"
import { type BlogLocale, blogPath, blogTagCounts } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"
import { TopicFilter } from "./blog-topic-filter"

/** Topic pills with counts, most used first, then a panel with every topic. Pills link to the public tag pages. */
export function TopicNav({ lang, active, pills = 8 }: { lang: string; active?: string; pills?: number }) {
  const words = blogWords(lang)
  const counts = blogTagCounts(lang)
  if (!counts.length) return null
  const total = counts.length
  return (
    <nav className="blog-topics" aria-label={words.tags}>
      <ul>
        <li>
          <Link href={blogPath(lang)} aria-current={active ? undefined : "page"}>
            {words.all}
          </Link>
        </li>
        {counts.slice(0, pills).map(({ tag, count }) => (
          <li key={tag.id}>
            <Link href={blogPath(lang, "tags", tag.id)} aria-current={active === tag.id ? "page" : undefined}>
              {tag.label[lang as BlogLocale]}
              <span className="blog-count">{count}</span>
            </Link>
          </li>
        ))}
      </ul>
      {total > pills && (
        <details className="blog-topics-all">
          <summary>
            <Tags aria-hidden="true" />
            {words.allTopics(total)}
            <ChevronDown aria-hidden="true" />
          </summary>
          <div className="blog-topics-panel">
            <TopicFilter label={words.filterTopics} />
            <ul>
              {counts
                .toSorted((a, b) => a.tag.label[lang as BlogLocale].localeCompare(b.tag.label[lang as BlogLocale]))
                .map(({ tag, count }) => (
                  <li key={tag.id} data-topic={tag.label[lang as BlogLocale].toLowerCase()}>
                    <Link href={blogPath(lang, "tags", tag.id)}>
                      {tag.label[lang as BlogLocale]}
                      <span className="blog-count">{count}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </details>
      )}
    </nav>
  )
}

/** Every topic in one block, sized by use; for the index sidebar. */
export function TopicCloud({ lang }: { lang: string }) {
  const counts = blogTagCounts(lang)
  const most = counts[0]?.count ?? 1
  return (
    <ul className="blog-cloud">
      {counts.map(({ tag, count }) => (
        <li key={tag.id} style={{ "--weight": (0.85 + (0.45 * count) / most).toFixed(2) } as React.CSSProperties}>
          <Link href={blogPath(lang, "tags", tag.id)}>
            {tag.label[lang as BlogLocale]}
            <span className="blog-count">{count}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
