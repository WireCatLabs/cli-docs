const last = (slugs: readonly string[]) => slugs.at(-1) ?? ""

/** Linked from llms.txt under Optional: skippable when an agent needs a shorter context. */
export const isSecondaryPage = (slugs: readonly string[]) => ["changelog", "roadmap"].includes(last(slugs))

/**
 * Changelogs describe past releases as if current and confuse agents; the per-group command pages
 * repeat the full command reference. Both stay reachable from llms.txt.
 */
export const inFullText = (slugs: readonly string[]) =>
  last(slugs) !== "changelog" && !(slugs.length === 2 && last(slugs).startsWith("commands-"))
