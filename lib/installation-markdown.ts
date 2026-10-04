import { siteUrl, tools } from "./shared"
import { wordsFor } from "./words"

export function installationMarkdown(lang: string): string {
  const words = wordsFor(lang)
  const docs = `${siteUrl}/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`
  return tools
    .toSorted((a) => (a.name === "tg" ? -1 : 1))
    .map(
      (tool) =>
        `### ${words.install} ${tool.name === "tg" ? "Telegram" : "MAX"} [#${tool.name}]\n\n${words.onboarding.paste}\n\n\`\`\`text\n${words.onboarding.prompt(tool.name, tool.package, docs)}\n\`\`\``,
    )
    .join("\n\n")
}

export function agentPromptMarkdown(tool: string, lang: string): string {
  const pkg = tools.find((item) => item.name === tool)?.package ?? `@leemour/${tool}-cli`
  const docs = `${siteUrl}/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`
  return `\`\`\`text\n${wordsFor(lang).onboarding.prompt(tool, pkg, docs)}\n\`\`\``
}
