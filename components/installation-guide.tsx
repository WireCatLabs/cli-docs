"use client"

import { useI18n } from "fumadocs-ui/contexts/i18n"
import { useLayoutEffect } from "react"
import { InstallTool } from "@/components/install-tool"
import { CopyText } from "@/components/text-snippet"
import { siteUrl, tools } from "@/lib/shared"
import { wordsFor } from "@/lib/words"

export function InstallationGuide({ terminal = false }: { terminal?: boolean }) {
  const { locale } = useI18n()
  return (
    <div className="not-prose my-5 grid gap-4">
      {tools
        .toSorted((a) => (a.name === "tg" ? -1 : 1))
        .map((tool) => (
          <InstallTool key={tool.name} tool={tool} lang={locale ?? "en"} terminal={terminal} />
        ))}
    </div>
  )
}

export function AgentInstallPrompt({ tool }: { tool: "tg" | "max" }) {
  const { locale } = useI18n()
  const lang = locale ?? "en"
  const pkg = tools.find((item) => item.name === tool)?.package ?? `@leemour/${tool}-cli`
  const docs = `${siteUrl}/llms.mdx/docs/${lang === "en" ? "" : `${lang}/`}installation/content.md`
  // Links to #tg or #max pick the messenger for every tab group. Only the visible tab's prompt is
  // mounted on load, so each prompt handles both anchors.
  useLayoutEffect(() => {
    const messenger = { "#tg": "telegram", "#max": "max" }[window.location.hash]
    if (!messenger) return
    try {
      sessionStorage.setItem("messenger", messenger)
    } catch {}
  }, [])
  return (
    <div className="not-prose my-4">
      <CopyText kind="prompt" lang={lang} text={wordsFor(lang).onboarding.prompt(tool, pkg, docs)} />
    </div>
  )
}
