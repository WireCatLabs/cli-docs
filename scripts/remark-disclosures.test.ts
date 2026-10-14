import { fromMarkdown } from "mdast-util-from-markdown"
import { expect, it } from "vitest"
import { remarkAnchorAliases } from "../lib/remark-anchor-aliases"
import { remarkDisclosures } from "../lib/remark-disclosures"

it("groups optional Markdown while retaining its heading, command and incoming anchor", () => {
  const tree = fromMarkdown(
    '<details id="own-app">\n<summary>Create your app</summary>\n\n<a id="old-client"></a>\n\n### Client\n\n```sh\ndrive personal session start\n```\n\n</details>\n\n## Next task',
  )
  remarkDisclosures()(tree)
  remarkAnchorAliases()(tree)
  expect(tree.children).toHaveLength(2)
  expect(tree.children[0]).toMatchObject({
    type: "mdxJsxFlowElement",
    name: "details",
    attributes: [{ name: "id", value: "own-app" }],
    children: [
      { name: "summary", children: [{ value: "Create your app" }] },
      { data: { hName: "span", hProperties: { id: "old-client" } } },
      { type: "heading", depth: 3 },
      { type: "code", lang: "sh", value: "drive personal session start" },
    ],
  })
})

it("leaves attributes and tags outside the allowlist unconverted", () => {
  const tree = fromMarkdown('<details onclick="run()">\n<summary>App</summary>\n\n<script>run()</script>')
  const before = structuredClone(tree)
  remarkDisclosures()(tree)
  expect(tree).toEqual(before)
})

it("does not interpret disclosure examples inside code fences", () => {
  const tree = fromMarkdown("```html\n<details><summary>Example</summary>\n```")
  const before = structuredClone(tree)
  remarkDisclosures()(tree)
  expect(tree).toEqual(before)
})

it("refuses an unterminated disclosure instead of hiding the remainder of the page", () => {
  const tree = fromMarkdown("<details><summary>App</summary>\n\n## Next task")
  expect(() => remarkDisclosures()(tree)).toThrow("closing details tag")
})
