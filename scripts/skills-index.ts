/**
 * `/.well-known/skills/`: each tool's SKILL.md at its reviewed release, and the `index.json` that lists them, so
 * `hermes skills install well-known:https://wirecat.dev/.well-known/skills/tg-cli` works.
 *
 * The shape is the Agent Skills Discovery RFC v0.1 (cloudflare/agent-skills-discovery-rfc@d9532a1f), which is
 * what Hermes's `WellKnownSkillSource` reads. v0.2 moved to `/.well-known/agent-skills/` with digests; Hermes
 * does not read that yet.
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { withVersion } from "@wirecat/cli-base/skill"
import { parse } from "yaml"

export const SKILLS_DIR = "public/.well-known/skills"

export type SkillEntry = { name: string; description: string; files: string[] }

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** The index entry for one SKILL.md in a folder named `folder`; throws when the two disagree. */
export const skillEntry = (folder: string, skill: string): SkillEntry => {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(skill)?.[1]
  if (frontmatter === undefined) throw new Error(`${folder}/SKILL.md: no frontmatter`)
  const { name, description } = (parse(frontmatter) ?? {}) as { name?: unknown; description?: unknown }
  if (name !== folder) throw new Error(`${folder}/SKILL.md: name ${JSON.stringify(name)} differs from its folder`)
  if (!NAME.test(folder) || folder.length > 64) throw new Error(`${folder}: not a valid skill name`)
  if (typeof description !== "string" || !description.trim()) throw new Error(`${folder}/SKILL.md: no description`)
  return { name, description: description.trim(), files: ["SKILL.md"] }
}

/** Copies a tool's `skills/<name>/SKILL.md`, stamped with the release version the way `skill install` stamps it. */
export const publishSkills = (checkout: string, root: string, version: string): string[] => {
  const source = join(checkout, "skills")
  const names = readdirSync(source, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
  for (const name of names) {
    const skill = withVersion(readFileSync(join(source, name, "SKILL.md"), "utf8"), version)
    skillEntry(name, skill)
    const destination = join(root, SKILLS_DIR, name)
    rmSync(destination, { recursive: true, force: true })
    mkdirSync(destination, { recursive: true })
    writeFileSync(join(destination, "SKILL.md"), skill)
  }
  return names
}

/** Rebuilds `index.json` from every published skill, so syncing one tool keeps the others listed. */
export const writeSkillsIndex = (root: string): SkillEntry[] => {
  const dir = join(root, SKILLS_DIR)
  mkdirSync(dir, { recursive: true })
  const skills = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((name) => skillEntry(name, readFileSync(join(dir, name, "SKILL.md"), "utf8")))
  writeFileSync(join(dir, "index.json"), `${JSON.stringify({ skills }, null, 2)}\n`)
  return skills
}
