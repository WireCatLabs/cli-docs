import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { publishSkills, SKILLS_DIR, skillEntry, writeSkillsIndex } from "./skills-index.ts"

const skill = (name: string) =>
  [
    "---",
    `name: ${name}`,
    "description: >-",
    "  Read the owner's chats.",
    "  Use when asked.",
    "---",
    "",
    "# Body",
    "",
  ].join("\n")

const temporary: string[] = []
const folder = () => {
  const dir = mkdtempSync(join(tmpdir(), "skills-index-"))
  temporary.push(dir)
  return dir
}
afterEach(() => {
  for (const dir of temporary.splice(0)) rmSync(dir, { recursive: true, force: true })
})

describe("skillEntry", () => {
  it("reads a folded description as one line of text", () => {
    expect(skillEntry("tg-cli", skill("tg-cli"))).toEqual({
      name: "tg-cli",
      description: "Read the owner's chats. Use when asked.",
      files: ["SKILL.md"],
    })
  })

  it("refuses a skill whose name is not its folder, since Hermes fetches <name>/SKILL.md", () => {
    expect(() => skillEntry("tg", skill("tg-cli"))).toThrow("differs from its folder")
    expect(() => skillEntry("tg-cli", "# no frontmatter")).toThrow("no frontmatter")
  })
})

describe("publishSkills and writeSkillsIndex", () => {
  it("publishes each tool's SKILL.md stamped with its release and lists every published skill", () => {
    const root = folder()
    for (const [tool, version] of [
      ["tg-cli", "0.92.0"],
      ["cli-memo", "0.97.0"],
    ]) {
      const checkout = folder()
      mkdirSync(join(checkout, "skills", tool), { recursive: true })
      writeFileSync(join(checkout, "skills", tool, "SKILL.md"), skill(tool))
      expect(publishSkills(checkout, root, version)).toEqual([tool])
    }

    const published = readFileSync(join(root, SKILLS_DIR, "tg-cli", "SKILL.md"), "utf8")
    expect(published).toMatch(/metadata:\n {2}version: "0\.92\.0"/)
    expect(published).toContain("# Body")

    writeSkillsIndex(root)
    const index = JSON.parse(readFileSync(join(root, SKILLS_DIR, "index.json"), "utf8"))
    expect(index.skills.map((entry: { name: string }) => entry.name)).toEqual(["cli-memo", "tg-cli"])
    expect(index.skills[1]).toEqual({
      name: "tg-cli",
      description: "Read the owner's chats. Use when asked.",
      files: ["SKILL.md"],
    })
  })
})
