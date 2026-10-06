"use client"

import { Tabs } from "fumadocs-ui/components/tabs"
import { type ReactNode, useEffect, useRef } from "react"

export function PlatformSetupTabs({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let chosen: string | null = null
    try {
      chosen = sessionStorage.getItem("remote-os") ?? localStorage.getItem("remote-os")
    } catch {}
    if (chosen) return
    const platform = /Windows/.test(navigator.userAgent)
      ? "Windows"
      : /Macintosh|Mac OS X/.test(navigator.userAgent)
        ? "macOS"
        : "Linux"
    const tab = [...(container.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])].find(
      (element) => element.textContent?.trim() === platform,
    )
    tab?.click()
  }, [])
  return (
    <div ref={container} className="platform-setup-tabs">
      <Tabs groupId="remote-os" persist items={["Windows", "macOS", "Linux"]}>
        {children}
      </Tabs>
    </div>
  )
}
