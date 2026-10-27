/**
 * The tag registry with how often each tag is used, for whoever chooses a post's tags.
 *
 *   pnpm blog:tags          table of id, uses, label and description
 *   pnpm blog:tags --json   the same as JSON
 */
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { parse } from "yaml"
import { blogTags, frontmatterProblems } from "../lib/blog-schema.ts"

const root = fileURLToPath(new URL("../content/blog/", import.meta.url))

/** Every post file with its front matter, drafts included. */
export function blogFrontmatters(directory = root) {
  return readdirSync(directory, { recursive: true })
    .map(String)
    .filter((file) => /(?:^|[\\/])index(?:\.(?:ru|es))?\.mdx?$/.test(file))
    .sort()
    .map((file) => {
      const text = readFileSync(join(directory, file), "utf8")
      const data = parse(/^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] ?? "") as unknown
      return { file, data, ...frontmatterProblems(data) }
    })
}

export function tagUsage(posts = blogFrontmatters()) {
  return blogTags.map((tag) => ({
    id: tag.id,
    // A post in two languages is still one post.
    uses: new Set(posts.filter((post) => post.value?.tags.includes(tag.id)).map((post) => post.file.split(/[\\/]/)[0]))
      .size,
    label: tag.label.en,
    aliases: tag.aliases,
    description: tag.description.en,
  }))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const usage = tagUsage()
  if (process.argv.includes("--json")) console.log(JSON.stringify(usage, null, 2))
  else
    for (const tag of usage)
      console.log(
        `${tag.id.padEnd(16)} ${String(tag.uses).padStart(3)}  ${tag.label}: ${tag.description} (also: ${tag.aliases.join(", ")})`,
      )
}
