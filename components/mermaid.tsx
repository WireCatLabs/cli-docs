import { DiagramFrame } from "@/components/diagram-frame"
import { diagramSvg } from "@/lib/mermaid"

export function Mermaid({ chart, caption, identity }: { chart: string; caption: string; identity: string }) {
  return (
    <figure className="docs-diagram my-6 rounded-lg border border-fd-border p-4">
      <DiagramFrame svg={diagramSvg(chart, identity)} caption={caption} />
      <figcaption className="mt-3 text-sm text-fd-muted-foreground">{caption}</figcaption>
    </figure>
  )
}
