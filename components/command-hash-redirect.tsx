"use client"
import { useEffect } from "react"
import { commandGroupForAnchor } from "@/lib/command-groups"
export function CommandHashRedirect({ tool, lang }: { tool: string; lang: string }) {
  useEffect(() => {
    const follow = () => {
      const hash = window.location.hash
      if (!hash) return
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
