export const linksDiagramPath = "/screenshots/start-here/how-wirecat-links"

const size = { wide: { width: 3200, height: 2163 }, tall: { width: 1800, height: 3405 } }

function Variant({ theme, alt, className }: { theme: "light" | "dark"; alt: string; className: string }) {
  const wide = `${linksDiagramPath}-wide-${theme}.webp`
  return (
    <a href={wide} target="_blank" rel="noopener" className={className}>
      <picture>
        <source media="(max-width: 640px)" srcSet={`${linksDiagramPath}-tall-${theme}.webp`} {...size.tall} />
        <img src={wide} alt={alt} loading="lazy" className="h-auto w-full" {...size.wide} />
      </picture>
    </a>
  )
}

/** The image carries its own page background, so it has no border and reads as part of the page in either theme. */
export function LinksDiagram({ alt, caption }: { alt: string; caption: string }) {
  return (
    <figure className="not-prose my-6">
      <Variant theme="light" alt={alt} className="block dark:hidden" />
      <Variant theme="dark" alt={alt} className="hidden dark:block" />
      <figcaption className="mt-2 text-sm text-fd-muted-foreground">{caption}</figcaption>
    </figure>
  )
}
