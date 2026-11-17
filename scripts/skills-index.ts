/**
 * `/.well-known/skills/`: each tool's skill folder (SKILL.md and the files it links, such as `references/`) at its
 * reviewed release, and the `index.json` that lists them, so
 * `hermes skills install well-known:https://wirecat.dev/.well-known/skills/tg-cli` works.
 *
 * The shape is the Agent Skills Discovery RFC v0.1 (cloudflare/agent-skills-discovery-rfc@d9532a1f), which is
 * what Hermes's `WellKnownSkillSource` reads. The same skills are also published in the v0.2.0 shape
 * (cloudflare/agent-skills-discovery-rfc@1bd1167) at `/.well-known/agent-skills/`, for clients that read only that:
 * a lone SKILL.md as `skill-md`, a skill with more files as a zip `archive`, as that RFC asks.
 */
import { createHash } from "node:crypto"
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { join, posix } from "node:path"
import { withVersion } from "@wirecat/cli-base/skill"
import { Ajv } from "ajv"
import { zipSync } from "fflate"
import { fromMarkdown } from "mdast-util-from-markdown"
import { parse } from "yaml"
import discoverySchema from "./agent-skills-discovery-0.2.0.schema.json" with { type: "json" }

export const SKILLS_DIR = "public/.well-known/skills"
export const AGENT_SKILLS_DIR = "public/.well-known/agent-skills"
const DISCOVERY_SCHEMA = "https://schemas.agentskills.io/discovery/0.2.0/schema.json"

export type AgentSkillEntry = {
  name: string
  type: "skill-md" | "archive"
  description: string
  url: string
  digest: string
}

const sha256 = (bytes: Buffer) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`

export type SkillEntry = { name: string; description: string; files: string[] }

const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** Every file in a skill folder, relative and with `/`, SKILL.md first. */
export const skillFiles = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => statSync(join(dir, file)).isFile())
    .map((file) => file.split("\\").join("/"))
    .sort((a, b) => (a === "SKILL.md" ? -1 : b === "SKILL.md" ? 1 : a.localeCompare(b)))

/** The index entry for one SKILL.md in a folder named `folder`; throws when the two disagree. */
export const skillEntry = (folder: string, skill: string, files = ["SKILL.md"]): SkillEntry => {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(skill)?.[1]
  if (frontmatter === undefined) throw new Error(`${folder}/SKILL.md: no frontmatter`)
  const { name, description } = (parse(frontmatter) ?? {}) as { name?: unknown; description?: unknown }
  if (name !== folder) throw new Error(`${folder}/SKILL.md: name ${JSON.stringify(name)} differs from its folder`)
  if (!NAME.test(folder) || folder.length > 64) throw new Error(`${folder}: not a valid skill name`)
  if (typeof description !== "string" || !description.trim()) throw new Error(`${folder}/SKILL.md: no description`)
  return { name, description: description.trim(), files }
}

type MarkdownNode = { type: string; url?: string; children?: MarkdownNode[] }

/**
 * The relative links in a skill's Markdown files that lead to no file of `files`: an agent that installed the skill,
 * or a reader on the site, would follow them to nothing.
 */
export const skillLinkProblems = (dir: string, files: string[]): string[] =>
  files
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      const urls: string[] = []
      const visit = (node: MarkdownNode) => {
        if (node.url !== undefined) urls.push(node.url)
        for (const child of node.children ?? []) visit(child)
      }
      visit(fromMarkdown(readFileSync(join(dir, file), "utf8")) as MarkdownNode)
      return urls
        .filter((url) => url && !url.startsWith("#") && !/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith("/"))
        .filter((url) => {
          const target = posix.normalize(posix.join(posix.dirname(file), decodeURI(url.replace(/[?#].*$/, ""))))
          return !files.includes(target)
        })
        .map((url) => `${file}: ${url} — the site does not publish it`)
    })

/**
 * Copies each of a tool's `skills/<name>/` folders, SKILL.md stamped with the release version the way `skill install`
 * stamps it; throws when a relative link in them leads outside what is copied.
 */
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
    cpSync(join(source, name), destination, { recursive: true })
    writeFileSync(join(destination, "SKILL.md"), skill)
    const problems = skillLinkProblems(destination, skillFiles(destination))
    if (problems.length) throw new Error(`skills/${name}:\n${problems.join("\n")}`)
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
  const skills = names.map((name) =>
    skillEntry(name, readFileSync(join(dir, name, "SKILL.md"), "utf8"), skillFiles(join(dir, name))),
  )
  writeFileSync(join(dir, "index.json"), `${JSON.stringify({ skills }, null, 2)}\n`)

  mkdirSync(agentDir, { recursive: true })
  const agentSkills = skills.map(({ name, description, files }): AgentSkillEntry => {
    if (files.length === 1) {
      const bytes = readFileSync(join(dir, name, "SKILL.md"))
      mkdirSync(join(agentDir, name), { recursive: true })
      writeFileSync(join(agentDir, name, "SKILL.md"), bytes)
      const url = `/.well-known/agent-skills/${name}/SKILL.md`
      return { name, type: "skill-md", description, url, digest: sha256(bytes) }
    }
    // A fixed time keeps the archive, and so its digest, the same for the same files.
    const entries = Object.fromEntries(files.map((file) => [file, new Uint8Array(readFileSync(join(dir, name, file)))]))
    const bytes = Buffer.from(zipSync(entries, { mtime: new Date("2026-01-01T00:00:00Z") }))
    writeFileSync(join(agentDir, `${name}.zip`), bytes)
    const url = `/.well-known/agent-skills/${name}.zip`
    return { name, type: "archive", description, url, digest: sha256(bytes) }
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
    ...skills.flatMap(({ name, files }) => {
      const missing = files.filter((file) => !existsSync(join(dir, name, file)))
      if (missing.length) return missing.map((file) => `.well-known/skills/${name}/${file}: missing`)
      return skillLinkProblems(join(dir, name), files).map((problem) => `.well-known/skills/${name}/${problem}`)
    }),
    ...agentSkillIndexProblems(out),
  ]
}
