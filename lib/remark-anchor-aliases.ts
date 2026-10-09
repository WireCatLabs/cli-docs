type Node = {
  type: string
  value?: string
  children?: Node[]
  data?: { hName?: string; hProperties?: Record<string, unknown> }
}

/** Markdown drops raw HTML; turn only our empty anchor aliases into safe span nodes. */
export function remarkAnchorAliases() {
  return (tree: Node) => {
    const visit = (node: Node) => {
      if (!node.children) return
      node.children = node.children.map((child) => {
        // Paired anchors are parsed as two inline HTML nodes inside a paragraph.
        const value =
          child.type === "html"
            ? child.value
            : child.type === "paragraph" && child.children?.every((part) => part.type === "html")
              ? child.children.map((part) => part.value ?? "").join("")
              : undefined
        const alias = /^<a id="([^"<>]+)"\s*(?:\/>|><\/a>)$/.exec(value?.trim() ?? "")
        // A block node, not emphasis: the Markdown copy for agents prints an empty emphasis as `**` and
        // joins the neighbouring blocks into it.
        if (alias) return { type: "paragraph", children: [], data: { hName: "span", hProperties: { id: alias[1] } } }
        visit(child)
        return child
      })
    }
    visit(tree)
  }
}
