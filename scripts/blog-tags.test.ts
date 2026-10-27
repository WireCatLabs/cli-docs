import { describe, expect, it } from "vitest"
import { type BlogTag, blogTags, frontmatterProblems, postTagProblems, registryProblems } from "../lib/blog-schema.ts"
import { blogFrontmatters, tagUsage } from "./blog-tags.ts"

const tag = (id: string, aliases: string[], label = id): BlogTag => ({
  id,
  aliases,
  label: { en: label, ru: label, es: label },
  description: { en: "d", ru: "d", es: "d" },
})
const post = { title: "T", description: "D", date: "2026-10-27" }

describe("blog tag registry", () => {
  it("is valid", () => {
    expect(registryProblems(blogTags)).toEqual([])
  })

  it("rejects a shared alias, a shared label and an alias that is another id", () => {
    expect(registryProblems([tag("ai-agents", ["agents"]), tag("tools", ["agents"])])).toEqual([
      'Alias "agents" is shared by tags "ai-agents" and "tools"',
    ])
    expect(registryProblems([tag("ai-agents", [], "Agents"), tag("bots", [], "agents")])).toContain(
      'Label "agents" is shared by tags "ai-agents" and "bots"',
    )
    expect(registryProblems([tag("ai-agents", ["cli"]), tag("cli", [])])).toEqual([
      'Id "cli" is shared by tags "ai-agents" and "cli"',
    ])
    expect(registryProblems([tag("AI agents", [])])[0]).toMatch(/lowercase words joined by hyphens/)
  })

  it("fails an unknown tag and names the id to use for an alias", () => {
    expect(postTagProblems(["ai-agents"])).toEqual([])
    expect(postTagProblems(["agents"])).toEqual(['tag "agents" is an alias; use the id "ai-agents"'])
    expect(postTagProblems(["AI-Agent"])).toEqual(['tag "AI-Agent" is an alias; use the id "ai-agents"'])
    expect(postTagProblems(["kubernetes"])[0]).toMatch(/not in content\/blog\/tags\.json/)
  })

  it("checks the front matter a build reads", () => {
    expect(frontmatterProblems({ ...post, tags: ["cli"] }).problems).toEqual([])
    expect(frontmatterProblems({ ...post, date: new Date("2026-10-27"), tags: ["cli"] }).value?.date).toBe("2026-10-27")
    expect(frontmatterProblems({ ...post, tags: ["terminal"] }).problems).toEqual([
      'tag "terminal" is an alias; use the id "cli"',
    ])
    expect(frontmatterProblems({ ...post, tags: ["cli"], cover: "./cover.png" }).problems).toEqual([
      '"coverAlt" is required with "cover"',
    ])
    expect(frontmatterProblems({ title: "T", tags: [] }).problems).toEqual([
      '"description" is required',
      '"date" is required',
      '"tags" needs at least one tag',
    ])
  })

  it("passes every post in content/blog and counts each post once", () => {
    const posts = blogFrontmatters()
    for (const { file, problems } of posts) expect(problems, file).toEqual([])
    const usage = tagUsage(posts)
    expect(usage.map((entry) => entry.id)).toEqual(blogTags.map((entry) => entry.id))
    const slugs = new Set(posts.map((entry) => entry.file.split(/[\\/]/)[0]))
    for (const entry of usage) expect(entry.uses).toBeLessThanOrEqual(slugs.size)
  })
})
