import authorRegistry from "../content/blog/authors.json" with { type: "json" }
import seriesRegistry from "../content/blog/series.json" with { type: "json" }
import registry from "../content/blog/tags.json" with { type: "json" }

export const blogLocales = ["en", "ru", "es"] as const
export type BlogLocale = (typeof blogLocales)[number]

export type BlogTag = {
  id: string
  aliases: string[]
  label: Record<BlogLocale, string>
  description: Record<BlogLocale, string>
}

export type BlogSeries = { id: string; title: Record<BlogLocale, string>; parts: string[] }

export type BlogAuthor = {
  id: string
  name: Record<BlogLocale, string>
  initials: string
  avatar?: string
  role?: Record<BlogLocale, string>
  bio?: Record<BlogLocale, string>
  links: { github?: string; linkedin?: string; telegram?: string }
}

/** One key number for the post's "At a glance" box; `href` points at the section that explains it. */
export type BlogGlance = { value: string; label: string; href?: string }

export type BlogFrontmatter = {
  title: string
  description: string
  date: string
  updated?: string
  tags: string[]
  cover?: string
  coverAlt?: string
  canonical?: string
  author?: string
  series?: string
  glance?: BlogGlance[]
  draft: boolean
}

export const blogTags = registry as BlogTag[]
export const blogSeries = seriesRegistry as BlogSeries[]
export const blogAuthors = authorRegistry as BlogAuthor[]

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const datePattern = /^\d{4}-\d{2}-\d{2}$/

/** Rules on the registry itself: one spelling per meaning. */
export function registryProblems(tags: readonly BlogTag[]): string[] {
  const problems: string[] = []
  const owners = new Map<string, string>()
  const claim = (key: string, owner: string, what: string) => {
    const previous = owners.get(key)
    if (previous && previous !== owner) problems.push(`${what} is shared by tags "${previous}" and "${owner}"`)
    else owners.set(key, owner)
  }
  for (const tag of tags) {
    if (!idPattern.test(tag.id)) problems.push(`Tag id "${tag.id}" must be lowercase words joined by hyphens`)
    claim(`spelling:${tag.id}`, tag.id, `Id "${tag.id}"`)
    for (const alias of tag.aliases) claim(`spelling:${alias.toLowerCase()}`, tag.id, `Alias "${alias}"`)
    for (const locale of blogLocales) {
      if (!tag.label?.[locale]?.trim()) problems.push(`Tag "${tag.id}" has no ${locale} label`)
      if (!tag.description?.[locale]?.trim()) problems.push(`Tag "${tag.id}" has no ${locale} description`)
      if (tag.label?.[locale])
        claim(`label:${locale}:${tag.label[locale].toLowerCase()}`, tag.id, `Label "${tag.label[locale]}"`)
    }
  }
  return problems
}

/** Rules on one post's tags: registry ids only, never an alias. */
export function postTagProblems(tags: readonly string[], registered: readonly BlogTag[] = blogTags): string[] {
  const ids = new Set(registered.map((tag) => tag.id))
  const problems: string[] = []
  for (const tag of tags) {
    if (ids.has(tag)) continue
    const owner = registered.find((candidate) =>
      candidate.aliases.some((alias) => alias.toLowerCase() === tag.toLowerCase()),
    )
    problems.push(
      owner
        ? `tag "${tag}" is an alias; use the id "${owner.id}"`
        : `tag "${tag}" is not in content/blog/tags.json; pick an existing id (pnpm blog:tags) or add the tag there`,
    )
  }
  if (new Set(tags).size !== tags.length) problems.push("a tag is listed twice")
  return problems
}

export function frontmatterProblems(data: unknown): { value?: BlogFrontmatter; problems: string[] } {
  const problems: string[] = []
  const input = (data ?? {}) as Record<string, unknown>
  const text = (key: string, required: boolean) => {
    const value = input[key]
    if (value === undefined || value === null) {
      if (required) problems.push(`"${key}" is required`)
      return undefined
    }
    if (typeof value !== "string" || !value.trim()) problems.push(`"${key}" must be non-empty text`)
    return typeof value === "string" ? value : undefined
  }
  // YAML reads an unquoted date as a Date; keep the calendar day the author wrote.
  const day = (key: string, required: boolean) => {
    const value = input[key]
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    const result = text(key, required)
    if (result !== undefined && !datePattern.test(result)) problems.push(`"${key}" must be a date like 2026-10-27`)
    return result
  }
  const value: BlogFrontmatter = {
    title: text("title", true) ?? "",
    description: text("description", true) ?? "",
    date: day("date", true) ?? "",
    updated: day("updated", false),
    tags: [],
    cover: text("cover", false),
    coverAlt: text("coverAlt", false),
    canonical: text("canonical", false),
    author: text("author", false),
    series: text("series", false),
    draft: input.draft === true,
  }
  if (value.author && !blogAuthors.some((author) => author.id === value.author))
    problems.push(`author "${value.author}" is not in content/blog/authors.json`)
  if (value.series && !blogSeries.some((series) => series.id === value.series))
    problems.push(`series "${value.series}" is not in content/blog/series.json`)
  if (input.glance !== undefined) {
    const glance = input.glance
    const valid =
      Array.isArray(glance) &&
      glance.length > 0 &&
      glance.every(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.value === "string" &&
          typeof item.label === "string" &&
          (item.href === undefined || typeof item.href === "string"),
      )
    if (valid) value.glance = glance as BlogGlance[]
    else problems.push(`"glance" must be a list of { value, label, href? } with text values`)
  }
  if (input.draft !== undefined && typeof input.draft !== "boolean") problems.push(`"draft" must be true or false`)
  if (!Array.isArray(input.tags) || !input.tags.every((tag) => typeof tag === "string"))
    problems.push(`"tags" must be a list of tag ids from content/blog/tags.json`)
  else {
    value.tags = input.tags
    if (!value.tags.length) problems.push(`"tags" needs at least one tag`)
    for (const problem of postTagProblems(value.tags)) problems.push(problem)
  }
  if (value.cover && !value.coverAlt) problems.push(`"coverAlt" is required with "cover"`)
  if (value.canonical && !/^https:\/\//.test(value.canonical)) problems.push(`"canonical" must be an https URL`)
  return problems.length ? { problems } : { value, problems }
}

/** A series lists each part once, and every id is used once across the registries. */
export function seriesProblems(series: readonly BlogSeries[]): string[] {
  const problems: string[] = []
  const ids = new Set<string>()
  for (const entry of series) {
    if (!idPattern.test(entry.id)) problems.push(`Series id "${entry.id}" must be lowercase words joined by hyphens`)
    if (ids.has(entry.id)) problems.push(`Series id "${entry.id}" is used twice`)
    ids.add(entry.id)
    for (const locale of blogLocales)
      if (!entry.title?.[locale]?.trim()) problems.push(`Series "${entry.id}" has no ${locale} title`)
    if (!entry.parts.length) problems.push(`Series "${entry.id}" has no parts`)
    if (new Set(entry.parts).size !== entry.parts.length) problems.push(`Series "${entry.id}" lists a part twice`)
  }
  return problems
}

const registryErrors = [...registryProblems(blogTags), ...seriesProblems(blogSeries)]
if (registryErrors.length) throw new Error(`content/blog registries:\n- ${registryErrors.join("\n- ")}`)

/** A Standard Schema (https://standardschema.dev), so fumadocs-mdx fails the build with these messages. */
export const blogFrontmatterSchema = {
  "~standard": {
    version: 1 as const,
    vendor: "wirecat-blog",
    types: undefined as unknown as { input: unknown; output: BlogFrontmatter },
    validate(data: unknown) {
      const { value, problems } = frontmatterProblems(data)
      return value ? { value } : { issues: problems.map((message) => ({ message })) }
    },
  },
}
