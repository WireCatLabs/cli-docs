"use client"
import { useEffect } from "react"
import { commandGroupForAnchor } from "@/lib/command-groups"

declare global {
  interface Window {
    __wirecatCommandFragments?: Record<string, string>
  }
}

export function CommandHashRedirect({ tool, lang }: { tool: string; lang: string }) {
  useEffect(() => {
    const follow = () => {
      const captured = window.__wirecatCommandFragments
      const path = window.location.pathname
      const hash = window.location.hash || captured?.[path]
      if (!hash) return
      if (captured) delete captured[path]
      window.location.replace(
        `/${lang}/docs/${tool}/commands-${hash.startsWith(`#${tool}-`) ? commandGroupForAnchor(hash) : "personal"}${hash}`,
      )
    }
    follow()
    window.addEventListener("hashchange", follow)
    return () => window.removeEventListener("hashchange", follow)
  }, [tool, lang])
  return null
}
