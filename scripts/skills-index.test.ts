import { createHash } from "node:crypto"
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { unzipSync } from "fflate"
import { afterEach, describe, expect, it } from "vitest"
import {
  AGENT_SKILLS_DIR,
  publishSkills,
  SKILLS_DIR,
  skillEntry,
  skillIndexProblems,
  writeSkillsIndex,
} from "./skills-index.ts"

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

    const out = join(root, "public")
    expect(skillIndexProblems(out)).toEqual([])
    rmSync(join(root, SKILLS_DIR, "tg-cli", "SKILL.md"))
    expect(skillIndexProblems(out)).toEqual([".well-known/skills/tg-cli/SKILL.md: missing"])
    expect(skillIndexProblems(folder())).toEqual([".well-known/skills/index.json: missing from the export"])
  })

  it("publishes the same skills in the v0.2.0 shape, each digest the sha256 of the served bytes", () => {
    const root = folder()
    const checkout = folder()
    mkdirSync(join(checkout, "skills", "tg-cli"), { recursive: true })
    writeFileSync(join(checkout, "skills", "tg-cli", "SKILL.md"), skill("tg-cli"))
    publishSkills(checkout, root, "0.92.0")
    mkdirSync(join(root, AGENT_SKILLS_DIR, "dropped-skill"), { recursive: true })
    writeSkillsIndex(root)

    const served = readFileSync(join(root, AGENT_SKILLS_DIR, "tg-cli", "SKILL.md"))
    expect(served).toEqual(readFileSync(join(root, SKILLS_DIR, "tg-cli", "SKILL.md")))
    expect(JSON.parse(readFileSync(join(root, AGENT_SKILLS_DIR, "index.json"), "utf8"))).toEqual({
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: [
        {
          name: "tg-cli",
          type: "skill-md",
          description: "Read the owner's chats. Use when asked.",
          url: "/.well-known/agent-skills/tg-cli/SKILL.md",
          digest: `sha256:${createHash("sha256").update(served).digest("hex")}`,
        },
      ],
    })

    const out = join(root, "public")
    expect(skillIndexProblems(out)).toEqual([])
    writeFileSync(join(root, AGENT_SKILLS_DIR, "tg-cli", "SKILL.md"), "changed")
    expect(skillIndexProblems(out)).toEqual([
      "/.well-known/agent-skills/tg-cli/SKILL.md: digest differs from the index",
    ])
    writeFileSync(join(root, AGENT_SKILLS_DIR, "index.json"), JSON.stringify({ skills: [] }))
    expect(skillIndexProblems(out)).toEqual([
      ".well-known/agent-skills/index.json: must have required property '$schema'",
    ])
  })

  it("publishes a skill's references beside SKILL.md, lists them, and ships them as one v0.2.0 archive", () => {
    const root = folder()
    const checkout = folder()
    mkdirSync(join(checkout, "skills", "gcal-cli", "references"), { recursive: true })
    writeFileSync(
      join(checkout, "skills", "gcal-cli", "SKILL.md"),
      `${skill("gcal-cli")}[Events](references/events.md)\n`,
    )
    writeFileSync(
      join(checkout, "skills", "gcal-cli", "references", "events.md"),
      "[Back](../SKILL.md) [Meet](meet.md)\n",
    )
    writeFileSync(join(checkout, "skills", "gcal-cli", "references", "meet.md"), "# Meet\n")
    publishSkills(checkout, root, "0.33.0")
    writeSkillsIndex(root)

    const files = ["SKILL.md", "references/events.md", "references/meet.md"]
    const index = JSON.parse(readFileSync(join(root, SKILLS_DIR, "index.json"), "utf8"))
    expect(index.skills[0].files).toEqual(files)
    const out = join(root, "public")
    expect(skillIndexProblems(out)).toEqual([])

    const agentIndex = JSON.parse(readFileSync(join(root, AGENT_SKILLS_DIR, "index.json"), "utf8"))
    expect(agentIndex.skills[0]).toMatchObject({ type: "archive", url: "/.well-known/agent-skills/gcal-cli.zip" })
    const archive = unzipSync(readFileSync(join(root, AGENT_SKILLS_DIR, "gcal-cli.zip")))
    expect(Object.keys(archive).sort()).toEqual(files)
    expect(Buffer.from(archive["SKILL.md"] ?? [])).toEqual(readFileSync(join(root, SKILLS_DIR, "gcal-cli", "SKILL.md")))

    rmSync(join(root, SKILLS_DIR, "gcal-cli", "references", "meet.md"))
    writeSkillsIndex(root)
    expect(skillIndexProblems(out)).toEqual([
      ".well-known/skills/gcal-cli/references/events.md: meet.md — the site does not publish it",
    ])
  })

  it("refuses a release whose skill links a file outside its skill folder", () => {
    const checkout = folder()
    mkdirSync(join(checkout, "skills", "zoom-cli"), { recursive: true })
    writeFileSync(
      join(checkout, "skills", "zoom-cli", "SKILL.md"),
      `${skill("zoom-cli")}[Setup](../../docs/setup.md)\n`,
    )
    expect(() => publishSkills(checkout, folder(), "0.79.0")).toThrow(
      "SKILL.md: ../../docs/setup.md — the site does not publish it",
    )
  })
})
