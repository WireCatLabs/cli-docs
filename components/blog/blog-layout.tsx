import type { ReactNode } from "react"

/**
 * The blog's page frame: a main column and a sidebar that stacks under it on small screens. `margin` holds
 * what sits in the page margin on very wide screens only (the post's contents), so it never narrows the text.
 */
export function BlogLayout({
  children,
  aside,
  margin,
  className,
}: {
  children: ReactNode
  aside?: ReactNode
  margin?: ReactNode
  className?: string
}) {
  return (
    <div className="wirecat-blog">
      <main id="main" className={["wrap blog-page", className].filter(Boolean).join(" ")}>
        {margin && <div className="blog-margin">{margin}</div>}
        <div className={aside ? "blog-columns" : undefined}>
          <div className="blog-main">{children}</div>
          {aside && <aside className="blog-sidebar">{aside}</aside>}
        </div>
      </main>
    </div>
  )
}

/** One sidebar block with a small heading. */
export function BlogWidget({
  title,
  icon,
  children,
  className,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={["blog-widget", className].filter(Boolean).join(" ")}>
      <h2 className="blog-widget-title">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )
}
