type Node = {
  type: string
  lang?: string | null
  value?: string
  meta?: string | null
  position?: { start: { line: number } }
  children?: Node[]
  [key: string]: unknown
}

export function remarkMermaid() {
  return (tree: Node, file: { path?: string }) => {
    const visit = (parent: Node) => {
      parent.children = parent.children?.map((node) => {
        if (node.type === "code" && node.lang === "mermaid")
          return {
            type: "mdxJsxFlowElement",
            name: "Mermaid",
            attributes: [
              { type: "mdxJsxAttribute", name: "chart", value: node.value ?? "" },
              { type: "mdxJsxAttribute", name: "caption", value: node.meta ?? "Diagram" },
              {
                type: "mdxJsxAttribute",
                name: "identity",
                value: `${file.path ?? "page"}:${node.position?.start.line ?? 0}`,
              },
            ],
            children: [],
          }
        if (node.children) visit(node)
        return node
      })
    }
    visit(tree)
  }
}
