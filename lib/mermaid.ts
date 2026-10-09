import { createHash } from "node:crypto"
import { parseMermaid, renderMermaidSVG } from "beautiful-mermaid"

export function diagramStructure(chart: string): string {
  const graph = parseMermaid(chart)
  const normalize = (value: unknown): unknown => {
    if (value instanceof Map) return [...value.entries()].map(([key, item]) => [key, normalize(item)])
    if (Array.isArray(value)) return value.map(normalize)
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => !["label", "title"].includes(key))
          .map(([key, item]) => [key, normalize(item)]),
      )
    return value
  }
  return JSON.stringify(normalize(graph))
}

export function diagramSvg(chart: string, identity: string): string {
  const svg = renderMermaidSVG(chart, {
    bg: "var(--color-fd-background)",
    fg: "var(--color-fd-foreground)",
    transparent: true,
  })
  const prefix = `diagram-${createHash("sha256")
    .update(identity + chart)
    .digest("hex")
    .slice(0, 12)}`
  const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1])
  let result = svg
  for (const id of ids)
    result = result
      .replaceAll(`id="${id}"`, `id="${prefix}-${id}"`)
      .replaceAll(`url(#${id})`, `url(#${prefix}-${id})`)
      .replaceAll(`href="#${id}"`, `href="#${prefix}-${id}"`)
  return result
}
