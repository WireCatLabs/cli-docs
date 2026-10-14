type Node = {
  type: string
  value?: string
  children?: Node[]
  name?: string | null
  attributes?: unknown[]
}

/** Preserve authored disclosures without enabling arbitrary HTML in imported Markdown. */
export function remarkDisclosures() {
  return (tree: Node) => {
    const visit = (parent: Node) => {
      if (!parent.children) return
      const result: Node[] = []
      const stack: Node[] = []
      const append = (node: Node) => (stack.at(-1)?.children ?? result).push(node)
      for (const node of parent.children) {
        const opening =
          node.type === "html"
            ? /^<details(?: id="([a-z][a-z0-9-]*)")?>\s*<summary>([^<>]+)<\/summary>\s*$/.exec(node.value ?? "")
            : null
        if (opening) {
          const disclosure: Node = {
            type: "mdxJsxFlowElement",
            name: "details",
            attributes: opening[1] ? [{ type: "mdxJsxAttribute", name: "id", value: opening[1] }] : [],
            children: [
              {
                type: "mdxJsxFlowElement",
                name: "summary",
                attributes: [],
                children: [{ type: "text", value: opening[2] }],
              },
            ],
          }
          append(disclosure)
          stack.push(disclosure)
        } else if (node.type === "html" && node.value?.trim() === "</details>" && stack.length) {
          stack.pop()
        } else {
          visit(node)
          append(node)
        }
      }
      if (stack.length) throw new Error("Documentation disclosure is missing its closing details tag")
      parent.children = result
    }
    visit(tree)
  }
}
