import { describe, expect, it } from "vitest"
import { docTerm } from "../lib/doc-terms"
import { expandDocTerms } from "../lib/doc-terms-markdown"

describe("documentation explanations for Markdown readers", () => {
  it.each(["en", "ru", "es"])("keeps %s explanations while preserving code examples", (lang) => {
    const hint = `<DocTerm term="local-agent" lang="${lang}" label="Agent" />`
    const input = `Ask ${hint}.\n\n\`\`\`mdx\n${hint}\n\`\`\`\n\nUse <DocTerm term="skill" />.`
    const result = expandDocTerms(input, lang)
    expect(result).toContain(`Ask Agent (${docTerm("local-agent", lang).description}).`)
    expect(result).toContain(`Use ${docTerm("skill", lang).title} (${docTerm("skill", lang).description}).`)
    expect(result).toContain(`\`\`\`mdx\n${hint}\n\`\`\``)
  })
  it("fails an unknown term so broken hints do not reach published agent docs", () => {
    expect(() => expandDocTerms('<DocTerm term="typo" />', "en")).toThrow("Unknown documentation term")
  })
})
