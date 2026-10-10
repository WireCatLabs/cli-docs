import { describe, expect, it } from "vitest"
import { installationMarkdown } from "../lib/installation-markdown"
import { resolveDocumentationLink, rewriteMarkdownLinks } from "../lib/markdown-links"
import { isStaticDocumentationResource } from "../lib/static-resource"

describe("exported Markdown destinations", () => {
  const known = new Map([
    ["/ru/docs/installation", "/llms.mdx/docs/ru/installation/content.md"],
    ["/ru/docs/tg", "/llms.mdx/docs/ru/tg/content.md"],
    ["/ru/docs/tg/sessions", "/llms.mdx/docs/ru/tg/sessions/content.md"],
    ["/en/docs/agents", "/llms.mdx/docs/agents/content.md"],
  ])
  const resolve = (href: string) =>
    resolveDocumentationLink(href, "/ru/docs/tg/usage", "https://wirecat.dev", (path) => known.get(path))

  it("resolves same-locale, parent and explicit cross-locale documentation links", () => {
    expect(resolve("./sessions.md#%D0%B2%D1%85%D0%BE%D0%B4")).toBe(
      "/llms.mdx/docs/ru/tg/sessions/content.md#%D0%B2%D1%85%D0%BE%D0%B4",
    )
    expect(resolve("../installation.mdx")).toBe("/llms.mdx/docs/ru/installation/content.md")
    expect(resolve("./index.md")).toBe("/llms.mdx/docs/ru/tg/content.md")
    expect(resolve("/en/docs/agents")).toBe("/llms.mdx/docs/agents/content.md")
  })

  it("preserves external URLs, assets, local anchors and unresolved targets for the checker", () => {
    for (const href of ["https://example.com/docs.md", "/max/logo.svg", "#вход", "./missing.md"])
      expect(resolve(href)).toBe(href)
  })

  it("resolves index-page links from their content directory", () => {
    expect(
      resolveDocumentationLink("./installation.mdx", "/ru/docs/", "https://wirecat.dev", (path) => known.get(path)),
    ).toBe("/llms.mdx/docs/ru/installation/content.md")
    expect(
      resolveDocumentationLink("./sessions.md", "/ru/docs/tg/", "https://wirecat.dev", (path) => known.get(path)),
    ).toBe("/llms.mdx/docs/ru/tg/sessions/content.md")
  })

  it("changes only parsed destinations, retaining executable fences, inline code, tables and titles", () => {
    const original =
      '[session](./sessions.md "Login")\n\n' +
      "| Task | Page |\n|---|---|\n| Login | [session](./sessions.md) |\n\n" +
      '`[session](./sessions.md)`\n\n```sh\necho "[session](./sessions.md)"\n```\n'
    expect(rewriteMarkdownLinks(original, resolve)).toBe(
      '[session](/llms.mdx/docs/ru/tg/sessions/content.md "Login")\n\n' +
        "| Task | Page |\n|---|---|\n| Login | [session](/llms.mdx/docs/ru/tg/sessions/content.md) |\n\n" +
        '`[session](./sessions.md)`\n\n```sh\necho "[session](./sessions.md)"\n```\n',
    )
  })

  it("preserves nested label formatting, angle destinations and reference-link titles", () => {
    expect(
      rewriteMarkdownLinks('[**login** [now]](<./sessions.md> "Title")\n\n[login]: ./sessions.md "Title"\n', resolve),
    ).toBe(
      '[**login** [now]](</llms.mdx/docs/ru/tg/sessions/content.md> "Title")\n\n[login]: /llms.mdx/docs/ru/tg/sessions/content.md "Title"\n',
    )
  })

  it("keeps a rewritten autolink clickable without changing its visible destination label", () => {
    expect(rewriteMarkdownLinks("<https://wirecat.dev/ru/docs/tg/sessions>\n", resolve)).toBe(
      "[https://wirecat.dev/ru/docs/tg/sessions](/llms.mdx/docs/ru/tg/sessions/content.md)\n",
    )
  })

  it.each(["en", "ru", "es"])("exports actionable install prompts for both providers in %s", (lang) => {
    const text = installationMarkdown(lang)
    expect(text).toContain("@wirecat/tg-cli")
    expect(text).toContain("@wirecat/max-cli")
    expect(text).toContain("[#tg]")
    expect(text).toContain("[#max]")
    expect(text).toContain("tg setup --help")
    expect(text).toContain("max doctor")
    expect(text).not.toContain("https://wirecat.dev/llms.mdx/docs/")
    expect(text).not.toContain("<InstallationGuide")
  })
})

describe("native resource navigation", () => {
  it("uses native navigation for the agent index, Markdown twins and installer", () => {
    for (const href of ["/llms.txt", "/llms-full.txt", "/llms.mdx/docs/content.md", "/install.ps1"])
      expect(isStaticDocumentationResource(href)).toBe(true)
    for (const href of ["/en/docs/agents", "./installation.mdx", "/ru/docs/tg/usage#вход", undefined])
      expect(isStaticDocumentationResource(href)).toBe(false)
  })
})
