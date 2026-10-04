import { type ComponentProps, createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { getMDXComponents } from "../components/mdx"

const ClientLink = (props: ComponentProps<"a">) => createElement("a", { ...props, "data-client-routing": "true" })

describe("rendered documentation resource links", () => {
  const Link = getMDXComponents({ a: ClientLink }).a

  it("bypasses the client router for static documentation downloads", () => {
    for (const href of [
      "/llms.txt",
      "/llms-full.txt",
      "/llms.mdx/docs/content.md",
      "/install.ps1",
      "https://wirecat.dev/llms.txt",
      "https://wirecat.dev/install.ps1?tool=max",
    ]) {
      const html = renderToStaticMarkup(createElement(Link, { href }, "Read documentation"))
      expect(html).toContain(`href="${href}"`)
      expect(html).toContain("Read documentation")
      expect(html).not.toContain("data-client-routing")
    }
  })

  it("retains the documentation resolver for ordinary page links", () => {
    const html = renderToStaticMarkup(createElement(Link, { href: "./installation.mdx" }, "Install"))
    expect(html).toContain('data-client-routing="true"')
  })
})
