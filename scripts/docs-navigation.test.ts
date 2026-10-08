import { readdirSync, readFileSync } from "node:fs"
import type { Root } from "fumadocs-core/page-tree"
import { describe, expect, it } from "vitest"
import { isGettingStarted, messengerHref } from "../lib/docs-navigation"
import { sidebarIcons, unifiedDocsTree } from "../lib/docs-sidebar-tree"

const pages = ["tg", "tg/installation", "tg/mcp", "max", "max/installation", "max/mcp", "max/bot"]

describe("switching documentation messengers", () => {
  it("keeps a section shared by both tools in the current language", () => {
    expect(messengerHref("/ru/docs/tg/installation", "ru", "max", pages)).toBe("/ru/docs/max/installation")
    expect(messengerHref("/es/docs/max/mcp", "es", "tg", pages)).toBe("/es/docs/tg/mcp")
  })

  it("falls back to the target overview for a tool-specific section", () => {
    expect(messengerHref("/en/docs/max/bot", "en", "tg", pages)).toBe("/en/docs/tg")
  })

  it("opens the chosen messenger from a shared guide or the docs index", () => {
    expect(messengerHref("/en/docs/agents", "en", "max", pages)).toBe("/en/docs/max")
    expect(messengerHref("/ru/docs", "ru", "tg", pages)).toBe("/ru/docs/tg")
  })
})

describe("getting-started navigation state", () => {
  it("selects Getting started for every shared guide and locale", () => {
    for (const lang of ["en", "ru", "es"]) {
      for (const section of ["", "/installation", "/agents", "/first-tasks", "/features", "/prompting", "/mcp"]) {
        expect(isGettingStarted(`/${lang}/docs${section}`)).toBe(true)
        expect(isGettingStarted(`/${lang}/docs${section}/`)).toBe(true)
      }
    }
  })
  it("does not select Getting started for messenger guides or other routes", () => {
    for (const path of ["/ru/docs/tg/installation", "/en/docs/max/mcp", "/en/about", "/ru/docs/installation-extra"])
      expect(isGettingStarted(path)).toBe(false)
  })
})

describe("one persistent documentation sidebar", () => {
  const original: Root = {
    name: "Docs",
    children: [
      { type: "page", name: "Install", url: "/ru/docs/installation" },
      {
        type: "folder",
        name: "Telegram",
        root: true,
        index: { type: "page", name: "Overview", url: "/ru/docs/tg" },
        children: [{ type: "page", name: "Sessions", url: "/ru/docs/tg/sessions" }],
      },
      {
        type: "folder",
        name: "MAX",
        root: true,
        children: [{ type: "page", name: "Sessions", url: "/ru/docs/max/sessions" }],
      },
    ],
  }
  it("keeps shared pages and both tools in one root, instead of selecting a different tree per route", () => {
    const tree = unifiedDocsTree(original)
    expect(tree.children.map((item) => item.name)).toEqual(["Install", "Telegram", "MAX"])
    for (const item of tree.children) {
      if (item.type === "folder") {
        expect(item.root).toBe(false)
        expect(item.defaultOpen).toBe(false)
        expect(item.children[0]).toHaveProperty("icon")
      }
    }
    expect(tree.children[1]).toMatchObject({ index: { url: "/ru/docs/tg" } })
  })
  it("does not modify the source tree used by breadcrumbs, Markdown and search", () => {
    unifiedDocsTree(original)
    expect(original.children[1]).toMatchObject({ root: true })
    expect(original.children[0]).not.toHaveProperty("icon")
    expect(original.children[1]).toMatchObject({ children: [{ url: "/ru/docs/tg/sessions" }] })
  })
})

// This inventory is available before sync in CI, unlike ignored generated tool pages.
describe("sidebar icon coverage", () => {
  it("assigns a specific subject icon to every shared and translated tool page", () => {
    const shared = JSON.parse(readFileSync(new URL("../content/docs/meta.json", import.meta.url), "utf8")) as {
      pages: string[]
    }
    const slugs = new Set(shared.pages.filter((slug) => !slug.startsWith("---") && !["tg", "max"].includes(slug)))
    for (const tool of ["tg", "max"])
      for (const file of readdirSync(new URL(`../translations/${tool}/`, import.meta.url)))
        if (/\.(en|ru|es)\.md$/.test(file)) slugs.add(file.replace(/\.(en|ru|es)\.md$/, ""))
    for (const slug of slugs) {
      expect(sidebarIcons, `Missing subject icon for ${slug}`).toHaveProperty(slug)
      const tree = unifiedDocsTree({
        name: "Docs",
        children: [{ type: "page", name: slug, url: `/en/docs/tg/${slug}` }],
      })
      expect(tree.children[0]).toHaveProperty("icon")
    }
  })
})
