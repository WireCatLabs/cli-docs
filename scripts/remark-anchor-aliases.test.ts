import { fromMarkdown } from "mdast-util-from-markdown"
import { expect, it } from "vitest"
import { remarkAnchorAliases } from "../lib/remark-anchor-aliases"

it("preserves standard and self-closing legacy anchors while leaving other HTML untouched", () => {
  const tree = fromMarkdown(
    '<a id="old-section"></a>\n\n<a id="older-section" />\n\n<a id="unsafe" onclick="run()"></a>',
  )
  const unsafe = structuredClone(tree.children[2])
  remarkAnchorAliases()(tree)
  expect(tree.children.slice(0, 2).map((node) => node.data)).toEqual([
    { hName: "span", hProperties: { id: "old-section" } },
    { hName: "span", hProperties: { id: "older-section" } },
  ])
  expect(tree.children[2]).toEqual(unsafe)
})

it("avoids duplicate IDs when an upstream alias repeats a heading or another alias", () => {
  const tree = fromMarkdown(
    '<a id="current-section"></a>\n\n## Current section\n\n<a id="old-section" />\n\n<a id="old-section"></a>',
  )
  remarkAnchorAliases()(tree)
  expect(tree.children.map((node) => node.type)).toEqual(["heading", "paragraph"])
  expect(tree.children[1].data).toEqual({ hName: "span", hProperties: { id: "old-section" } })
})
