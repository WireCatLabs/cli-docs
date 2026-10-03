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
        const alias = child.type === "html" ? /^<a id="([^"<>]+)"\s*\/>$/.exec(child.value?.trim() ?? "") : null
        if (alias) return { type: "emphasis", children: [], data: { hName: "span", hProperties: { id: alias[1] } } }
        visit(child)
        return child
      })
    }
    visit(tree)
  }
}
