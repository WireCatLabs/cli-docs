import { existsSync } from "node:fs"
import { join } from "node:path"

type Tree = { children: unknown[] }
type File = { dirname?: string; path?: string; data: Record<string, unknown> }

/**
 * The cover lives in front matter, beside the post, so the bundler never sees it. Import it from the
 * compiled post and export it as `cover`, the same way remark-image imports body images.
 */
export function remarkBlogCover() {
  return (tree: Tree, file: File) => {
    const cover = (file.data.frontmatter as { cover?: unknown } | undefined)?.cover
    if (typeof cover !== "string" || /^https?:\/\//.test(cover)) return
    const relative = cover.startsWith("./") ? cover : `./${cover}`
    if (!file.dirname || !existsSync(join(file.dirname, relative)))
      throw new Error(`${file.path}: cover "${cover}" is not a file beside the post`)
    tree.children.unshift({
      type: "mdxjsEsm",
      value: "",
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            {
              type: "ImportDeclaration",
              source: { type: "Literal", value: relative },
              specifiers: [{ type: "ImportDefaultSpecifier", local: { type: "Identifier", name: "__blogCover" } }],
            },
            {
              type: "ExportNamedDeclaration",
              specifiers: [],
              source: null,
              declaration: {
                type: "VariableDeclaration",
                kind: "const",
                declarations: [
                  {
                    type: "VariableDeclarator",
                    id: { type: "Identifier", name: "cover" },
                    init: { type: "Identifier", name: "__blogCover" },
                  },
                ],
              },
            },
          ],
        },
      },
    })
  }
}

type Node = { type: string; name?: string; value?: string; children?: Node[] }

/** An image alone in its paragraph is a figure; lift it out so the figure is not nested in a <p>. */
export function remarkBlogFigures() {
  return (tree: Tree) => {
    const children = tree.children as Node[]
    tree.children = children.map((node) => {
      const content =
        node.type === "paragraph" ? (node.children ?? []).filter((child) => child.value?.trim() !== "") : []
      const [only] = content
      return content.length === 1 && only.type === "mdxJsxFlowElement" && only.name === "img" ? only : node
    })
  }
}
