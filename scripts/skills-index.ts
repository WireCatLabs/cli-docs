/**
 * `/.well-known/skills/`: each tool's SKILL.md at its reviewed release, and the `index.json` that lists them, so
 * `hermes skills install well-known:https://wirecat.dev/.well-known/skills/tg-cli` works.
 *
 * The shape is the Agent Skills Discovery RFC v0.1 (cloudflare/agent-skills-discovery-rfc@d9532a1f), which is
 * what Hermes's `WellKnownSkillSource` reads. The same skills are also published in the v0.2.0 shape
 * (cloudflare/agent-skills-discovery-rfc@1bd1167) at `/.well-known/agent-skills/`, for clients that read only that.
 */
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { withVersion } from "@wirecat/cli-base/skill"
import { Ajv } from "ajv"
import { parse } from "yaml"
import discoverySchema from "./agent-skills-discovery-0.2.0.schema.json" with { type: "json" }

export const SKILLS_DIR = "public/.well-known/skills"
export const AGENT_SKILLS_DIR = "public/.well-known/agent-skills"
const DISCOVERY_SCHEMA = "https://schemas.agentskills.io/discovery/0.2.0/schema.json"

export type AgentSkillEntry = { name: string; type: "skill-md"; description: string; url: string; digest: string }

const sha256 = (bytes: Buffer) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`

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

/**
 * Rebuilds both indexes from every published skill, so syncing one tool keeps the others listed. The v0.2.0 folder
 * is a copy of the v0.1 one, emptied first so it can never list a skill the v0.1 index has dropped.
 */
export const writeSkillsIndex = (root: string): SkillEntry[] => {
  const dir = join(root, SKILLS_DIR)
  const agentDir = join(root, AGENT_SKILLS_DIR)
  mkdirSync(dir, { recursive: true })
  rmSync(agentDir, { recursive: true, force: true })
  const names = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
  const skills = names.map((name) => skillEntry(name, readFileSync(join(dir, name, "SKILL.md"), "utf8")))
  writeFileSync(join(dir, "index.json"), `${JSON.stringify({ skills }, null, 2)}\n`)

  const agentSkills = skills.map(({ name, description }): AgentSkillEntry => {
    const bytes = readFileSync(join(dir, name, "SKILL.md"))
    mkdirSync(join(agentDir, name), { recursive: true })
    writeFileSync(join(agentDir, name, "SKILL.md"), bytes)
    const url = `/.well-known/agent-skills/${name}/SKILL.md`
    return { name, type: "skill-md", description, url, digest: sha256(bytes) }
  })
  const index = { $schema: DISCOVERY_SCHEMA, skills: agentSkills }
  writeFileSync(join(agentDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`)
  return skills
}

const validateDiscoveryIndex = new Ajv({ allErrors: true }).compile(discoverySchema)

/** What a v0.2.0 client would refuse in the exported site: a schema error, a missing file or a digest mismatch. */
const agentSkillIndexProblems = (out: string): string[] => {
  const index = join(out, ".well-known/agent-skills/index.json")
  if (!existsSync(index)) return [".well-known/agent-skills/index.json: missing from the export"]
  const parsed = JSON.parse(readFileSync(index, "utf8")) as { skills: AgentSkillEntry[] }
  if (!validateDiscoveryIndex(parsed)) {
    return (validateDiscoveryIndex.errors ?? []).map(
      (error) => `.well-known/agent-skills/index.json${error.instancePath}: ${error.message}`,
    )
  }
  return parsed.skills.flatMap(({ url, digest }) => {
    const file = join(out, url)
    if (!existsSync(file)) return [`${url}: missing`]
    return sha256(readFileSync(file)) === digest ? [] : [`${url}: digest differs from the index`]
  })
}

/** What a client of either index would miss or refuse in the exported site; empty when every listed skill is served. */
export const skillIndexProblems = (out: string): string[] => {
  const dir = join(out, ".well-known/skills")
  const index = join(dir, "index.json")
  if (!existsSync(index)) return [".well-known/skills/index.json: missing from the export"]
  const { skills } = JSON.parse(readFileSync(index, "utf8")) as { skills: SkillEntry[] }
  if (skills.length === 0) return [".well-known/skills/index.json: lists no skills"]
  return [
    ...skills.flatMap(({ name, files }) =>
      files
        .filter((file) => !existsSync(join(dir, name, file)))
        .map((file) => `.well-known/skills/${name}/${file}: missing`),
    ),
    ...agentSkillIndexProblems(out),
  ]
}
