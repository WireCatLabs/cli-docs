import { describe, expect, it } from "vitest"
import { rehypeCodeAccessibility } from "../lib/rehype-code-accessibility"
import { remarkDocUsability } from "../lib/remark-doc-usability"

describe("accessible reference presentation", () => {
  it("gives code scroll regions unique localized names without changing executable text or dark tokens", () => {
    const text = { type: "text", value: "tg messages search 'invoice' --json" }
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "pre",
          properties: {},
          children: [
            {
              type: "element",
              tagName: "span",
              properties: { style: "color:#66707B;--shiki-dark:#9DA5B4" },
              children: [text],
            },
          ],
        },
        { type: "element", tagName: "pre", properties: {}, children: [text] },
      ],
    }
    rehypeCodeAccessibility()(tree, { path: "/content/docs/tg/search.ru.md" })
    expect(tree.children[0].properties).toMatchObject({ "data-code-label": "Пример команды 1" })
    expect(tree.children[1].properties).toMatchObject({ "data-code-label": "Пример команды 2" })
    expect(tree.children[0].children[0]).toMatchObject({
      properties: { style: "color:#525C66;--shiki-dark:#9DA5B4" },
      children: [text],
    })
  })
  it("names empty requirement headers while preserving authored names, data cells and table identity", () => {
    const cell = (value: string) => ({ type: "tableCell", children: [{ type: "text", value }] })
    const table = () => ({
      type: "table",
      children: [
        { type: "tableRow", children: [cell("Argument"), cell("")] },
        { type: "tableRow", children: [cell("chat"), cell("optional")] },
      ],
    })
    const tree = { type: "root", children: [table(), table()] }
    remarkDocUsability(new Map())(tree, { path: "/content/docs/tg/commands.es.md" })
    expect(tree.children[0]).toMatchObject({
      data: { hProperties: { "data-table-label": "Tabla de referencia 1" } },
      children: [
        { children: [cell("Argument"), cell("Obligatoriedad")] },
        { children: [cell("chat"), cell("optional")] },
      ],
    })
    expect(tree.children[1]).toMatchObject({ data: { hProperties: { "data-table-label": "Tabla de referencia 2" } } })
  })
})
