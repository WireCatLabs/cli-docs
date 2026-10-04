"use client"

import { useI18n } from "fumadocs-ui/contexts/i18n"
import { InstallTool } from "@/components/install-tool"
import { tools } from "@/lib/shared"

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
