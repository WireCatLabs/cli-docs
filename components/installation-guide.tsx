"use client"

import { Tabs } from "fumadocs-ui/components/tabs"
import { useI18n } from "fumadocs-ui/contexts/i18n"
import { type ReactNode, useEffect } from "react"
import { InstallTool } from "@/components/install-tool"
import { CopyText } from "@/components/text-snippet"
import { tools } from "@/lib/shared"
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

export function InstallationMessengerTabs({ children }: { children: ReactNode }) {
  // The anchors exist in server HTML; activate the matching messenger after tab groups mount.
  useEffect(() => {
    const followHash = () => {
      const label = { "#tg": "Telegram", "#max": "MAX" }[window.location.hash]
      if (!label) return
      const tab = [...document.querySelectorAll<HTMLButtonElement>('.wirecat-docs [role="tab"]')].find(
        (element) => element.textContent?.trim() === label,
      )
      if (tab?.getAttribute("aria-selected") !== "true") tab?.click()
    }
    followHash()
    window.addEventListener("hashchange", followHash)
    return () => window.removeEventListener("hashchange", followHash)
  }, [])
  return (
    <Tabs groupId="messenger" persist items={["Telegram", "MAX"]}>
      {children}
    </Tabs>
  )
}

export function AgentInstallPrompt({ tool }: { tool: "tg" | "max" }) {
  const { locale } = useI18n()
  const lang = locale ?? "en"
  const pkg = tools.find((item) => item.name === tool)?.package ?? `@leemour/${tool}-cli`
  return (
    <div className="not-prose my-4">
      <CopyText kind="prompt" lang={lang} text={wordsFor(lang).onboarding.prompt(tool, pkg)} />
    </div>
  )
}

export function InstallationOsTabs({ children }: { children: ReactNode }) {
  // Windows visitors start on the Windows tab unless they already chose a system on this site.
  useEffect(() => {
    let chosen: string | null = null
    try {
      chosen = sessionStorage.getItem("os") ?? localStorage.getItem("os")
    } catch {}
    if (chosen || !navigator.userAgent.includes("Windows")) return
    const tab = [...document.querySelectorAll<HTMLButtonElement>('.wirecat-docs [role="tab"]')].find(
      (element) => element.textContent?.trim() === "Windows",
    )
    if (tab?.getAttribute("aria-selected") !== "true") tab?.click()
  }, [])
  return (
    <Tabs groupId="os" persist items={["macOS / Linux", "Windows"]}>
      {children}
    </Tabs>
  )
}
