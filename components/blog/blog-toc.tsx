"use client"

import { AnchorProvider, type TableOfContents, TOCItem } from "fumadocs-core/toc"
import { ChevronDown } from "lucide-react"

/**
 * The post's contents. `variant="top"` is a folded list above the text; `variant="margin"` is the sticky list in
 * the page margin on very wide screens. CSS shows one of them, so the text column never narrows for it.
 */
export function BlogToc({
  title,
  items,
  variant,
}: {
  title: string
  items: TableOfContents
  variant: "top" | "margin"
}) {
  if (items.length < 3) return null
  const list = (
    <AnchorProvider toc={items} single>
      <ol>
        {items.map((item) => (
          <li key={item.url} data-depth={item.depth}>
            <TOCItem href={item.url}>{item.title}</TOCItem>
          </li>
        ))}
      </ol>
    </AnchorProvider>
  )
  if (variant === "margin")
    return (
      <nav className="blog-toc blog-toc-margin" aria-label={title}>
        <p className="blog-kicker">{title}</p>
        {list}
      </nav>
    )
  return (
    <details className="blog-toc blog-toc-top">
      <summary>
        {title}
        <ChevronDown aria-hidden="true" />
      </summary>
      <nav aria-label={title}>{list}</nav>
    </details>
  )
}
