type Node = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: Node[] }

export function rehypeCodeAccessibility() {
  return (tree: Node, file: { path?: string }) => {
    const lang = /\.(ru|es)\.mdx?$/.exec(file.path ?? "")?.[1] ?? "en"
    let example = 0
    const visit = (node: Node) => {
      if (node.tagName === "pre") {
        example++
        node.properties = {
          ...node.properties,
          "data-code-label": `${{ en: "Code example", ru: "Пример команды", es: "Ejemplo de código" }[lang]} ${example}`,
        }
      }
      if (node.tagName === "span" && typeof node.properties?.style === "string")
        node.properties.style = node.properties.style.replaceAll("#66707B", "#525C66").replaceAll("#66707b", "#525C66")
      for (const child of node.children ?? []) visit(child)
    }
    visit(tree)
  }
}
