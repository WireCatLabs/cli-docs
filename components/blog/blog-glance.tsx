import type { BlogGlance } from "@/lib/blog"
import { blogWords } from "@/lib/blog-words"

/** The post's key numbers from its `glance:` front matter, each linking to the section that explains it. */
export function Glance({ lang, items }: { lang: string; items?: BlogGlance[] }) {
  if (!items?.length) return null
  const title = blogWords(lang).glance
  return (
    <section className="blog-glance" aria-label={title}>
      <p className="blog-kicker">{title}</p>
      <dl>
        {items.map((item) => (
          <div key={item.value + item.label}>
            <dt>{item.href ? <a href={item.href}>{item.value}</a> : item.value}</dt>
            <dd>{item.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
