"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { RuntimeRequirements } from "@/components/runtime-requirements"
import { CopyText } from "@/components/text-snippet"
import type { Tool } from "@/lib/shared"
import { wordsFor } from "@/lib/words"

export function InstallTool({ tool, lang, terminal = true }: { tool: Tool; lang: string; terminal?: boolean }) {
  const words = wordsFor(lang)
  const ui = words.onboarding
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const followHash = () => {
      if (window.location.hash === `#${tool.name}`) setOpen(true)
    }
    followHash()
    window.addEventListener("hashchange", followHash)
    return () => window.removeEventListener("hashchange", followHash)
  }, [tool.name])
  return (
    <details
      id={tool.name}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      className="group min-w-0 scroll-mt-20 rounded-xl border bg-fd-card"
    >
      <summary className="cursor-pointer rounded-xl px-5 py-4 text-center font-semibold hover:bg-fd-muted focus-visible:outline-2 focus-visible:outline-offset-2">
        {words.install} {tool.name === "tg" ? "Telegram" : "MAX"}
      </summary>
      <div className="space-y-4 border-t p-5">
        <p className="text-sm text-fd-muted-foreground">{ui.paste}</p>
        <CopyText
          kind="prompt"
          lang={lang}
          text={ui.prompt(tool.name, tool.package)}
          tracking={{ tool: tool.name as "tg" | "max", locale: lang, surface: "installation" }}
        />
        <Link href={`/${lang}/docs/agents`} className="inline-block text-sm">
          {words.navigation.agents} →
        </Link>
        {terminal && (
          <details className="rounded-lg border p-3">
            <summary className="cursor-pointer text-sm font-medium">{ui.terminal}</summary>
            <div className="mt-4 space-y-4">
              <p className="text-sm text-fd-muted-foreground">
                <RuntimeRequirements lang={lang} />
              </p>
              <Link href={`/${lang}/docs/installation#nodejs`} className="inline-block text-sm">
                {ui.nodeHelp} →
              </Link>
              <CopyText
                lang={lang}
                text={`npm install -g ${tool.package}`}
                tracking={{ tool: tool.name as "tg" | "max", locale: lang, surface: "installation" }}
              />
              <p className="text-sm font-medium">{ui.login}</p>
              <CopyText lang={lang} text={`${tool.name} setup`} />
              <Link href={`/${lang}/docs/${tool.name}/sessions`} className="inline-block text-sm">
                {words.docs} →
              </Link>
            </div>
          </details>
        )}
        <p className="text-xs text-fd-muted-foreground">{ui.timing}</p>
        <p className="text-xs text-fd-muted-foreground">{ui.browser}</p>
      </div>
    </details>
  )
}
