"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/** Deep links and the TOC must reveal sections even when their details are closed. */
export function DocsDisclosures() {
  const pathname = usePathname()
  useEffect(() => {
    const reveal = () => {
      let id: string
      try {
        id = decodeURIComponent(location.hash.slice(1))
      } catch {
        return
      }
      const target = document.getElementById(id)
      if (!target) return
      let disclosure = target.closest("details")
      while (disclosure) {
        disclosure.open = true
        disclosure = disclosure.parentElement?.closest("details") ?? null
      }
      if (target.closest("details")) target.scrollIntoView()
    }
    reveal()
    window.addEventListener("hashchange", reveal)
    // TOC links can update history without a hashchange event.
    const onClick = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a") : null
      if (!anchor?.hash || anchor.origin !== location.origin || anchor.pathname !== pathname) return
      let id: string
      try {
        id = decodeURIComponent(anchor.hash.slice(1))
      } catch {
        return
      }
      const target = document.getElementById(id)
      let disclosure = target?.closest("details")
      while (disclosure) {
        disclosure.open = true
        disclosure = disclosure.parentElement?.closest("details") ?? null
      }
    }
    document.addEventListener("click", onClick, true)
    return () => {
      window.removeEventListener("hashchange", reveal)
      document.removeEventListener("click", onClick, true)
    }
  }, [pathname])
  return null
}
