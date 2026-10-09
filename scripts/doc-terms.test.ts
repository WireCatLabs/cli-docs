import { describe, expect, it } from "vitest"
import { docTerm } from "../lib/doc-terms"
import { dedentDocComponents, expandDocTerms } from "../lib/doc-terms-markdown"
import { wordsFor } from "../lib/words"

describe("documentation explanations for Markdown readers", () => {
  it.each(["en", "ru", "es"])("keeps %s explanations while preserving code examples", (lang) => {
    const hint = `<DocTerm term="local-agent" lang="${lang}" label="Agent" />`
    const input = `Ask ${hint}.\n\n\`\`\`mdx\n${hint}\n\`\`\`\n\nUse <DocTerm term="skill" />.`
    const result = expandDocTerms(input, lang)
    expect(result).toContain(`Ask Agent (${docTerm("local-agent", lang).description}).`)
    expect(result).toContain(`Use ${docTerm("skill", lang).title} (${docTerm("skill", lang).description}).`)
    expect(result).toContain(`\`\`\`mdx\n${hint}\n\`\`\``)
  })
  it.each(["en", "ru", "es"])("exports the actual Node setup prompt in %s without changing code examples", (lang) => {
    const component = `<NodeSetupPrompt lang="${lang}" />`
    const text = expandDocTerms(`${component}\n\n\`\`\`mdx\n${component}\n\`\`\``, lang)
    expect(text).toContain(`\`\`\`text\n${wordsFor(lang).onboarding.nodePrompt}\n\`\`\``)
    expect(text).toContain(`\`\`\`mdx\n${component}\n\`\`\``)
  })
  it("fails an unknown term so broken hints do not reach published agent docs", () => {
    expect(() => expandDocTerms('<DocTerm term="typo" />', "en")).toThrow("Unknown documentation term")
  })
  it.each(["en", "ru", "es"])(
    "exports tabbed %s instructions and screenshots without changing component examples",
    (lang) => {
      const prompt = '<AgentInstallPrompt tool="max" />'
      const input = `<Tabs items={["Telegram", "MAX"]}>\n\n<Tab value="MAX">\n\n${prompt}\n\n<Screenshot src="/screenshots/example.png" alt="API screen" />\n\n</Tab>\n\n</Tabs>\n\n\`\`\`mdx\n${prompt}\n\`\`\``
      const result = expandDocTerms(input, lang)
      expect(result).toContain("**MAX**")
      expect(result).toContain(wordsFor(lang).onboarding.prompt("max", "@leemour/max-cli"))
      expect(result).toContain("![API screen](/screenshots/example.png)")
      expect(result).not.toContain("<Tabs")
      expect(result).toContain(`\`\`\`mdx\n${prompt}\n\`\`\``)
    },
  )
})

describe("dedentDocComponents", () => {
  it("lifts tab and callout content out of the indentation that made it a code block", () => {
    const processed = [
      '<Callout type="info" title="Browser?">',
      "  Follow the [guide](./browser-apps.mdx).",
      "</Callout>",
      "",
      '<Tabs items={["A"]}>',
      '  <Tab value="A">',
      "    Add a connection with the [MCP guide](./mcp.mdx).",
      "",
      "    ```json",
      '    { "a": { "b": 1 } }',
      "    ```",
      "  </Tab>",
      "</Tabs>",
    ].join("\n")
    const out = dedentDocComponents(processed)
    expect(out).toContain("\nFollow the [guide](./browser-apps.mdx).")
    expect(out).toContain("\nAdd a connection with the [MCP guide](./mcp.mdx).")
    expect(out).toContain('\n{ "a": { "b": 1 } }')
  })
})
