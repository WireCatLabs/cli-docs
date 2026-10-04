import { tools } from "./shared"
import { wordsFor } from "./words"

export function installationMarkdown(lang: string): string {
  const words = wordsFor(lang)
  return tools
    .toSorted((a) => (a.name === "tg" ? -1 : 1))
    .map(
      (tool) =>
        `### ${words.install} ${tool.name === "tg" ? "Telegram" : "MAX"} [#${tool.name}]\n\n${words.onboarding.paste}\n\n\`\`\`text\n${words.onboarding.prompt(tool.name, tool.package)}\n\`\`\``,
    )
    .join("\n\n")
}

export function agentPromptMarkdown(tool: string, lang: string): string {
  const pkg = tools.find((item) => item.name === tool)?.package ?? `@leemour/${tool}-cli`
  return `\`\`\`text\n${wordsFor(lang).onboarding.prompt(tool, pkg)}\n\`\`\``
}
