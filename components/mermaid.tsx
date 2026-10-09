import { diagramSvg } from "@/lib/mermaid"

export function Mermaid({ chart, caption, identity }: { chart: string; caption: string; identity: string }) {
  return (
    <figure className="my-6 rounded-lg border border-fd-border p-4">
      <div
        role="img"
        aria-label={caption}
        className="overflow-auto [&_svg]:h-auto [&_svg]:min-w-80 [&_svg]:max-w-full"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users can scroll a wide diagram.
        tabIndex={0}
      >
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG is generated at build time from reviewed repository diagrams. */}
        <div dangerouslySetInnerHTML={{ __html: diagramSvg(chart, identity) }} />
      </div>
      <figcaption className="mt-3 text-sm text-fd-muted-foreground">{caption}</figcaption>
    </figure>
  )
}
