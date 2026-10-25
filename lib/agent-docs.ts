import type { Tool } from "../scripts/sync"
import { wordsFor } from "./words"

const last = (slugs: readonly string[]) => slugs.at(-1) ?? ""

/** Linked from llms.txt under Optional: skippable when an agent needs a shorter context. */
export const isSecondaryPage = (slugs: readonly string[]) => ["changelog", "roadmap"].includes(last(slugs))

/**
 * Changelogs describe past releases as if current and confuse agents; the per-group command pages
 * repeat the full command reference. Both stay reachable from llms.txt.
 */
export const inFullText = (slugs: readonly string[]) =>
  last(slugs) !== "changelog" && !(slugs.length === 2 && last(slugs).startsWith("commands-"))

export const isCommunity = (tool: Tool) => tool.community === true

/** Our tools first; community tools follow under their own heading, which appears only while one is listed. */
export const toolSections = (list: readonly Tool[], section: (tool: Tool) => string): string[] => {
  const community = list.filter(isCommunity)
  return [
    ...list.filter((tool) => !isCommunity(tool)).map(section),
    ...(community.length
      ? [
          `## ${wordsFor("en").navigation.communityTools}\n\nOutside tools, made and maintained by their own authors, not by WireCat. Each was reviewed before it was listed.`,
          ...community.map(section),
        ]
      : []),
  ]
}
