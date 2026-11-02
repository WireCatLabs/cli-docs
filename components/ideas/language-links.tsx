"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

/**
 * The shared language menu is built from the path alone, so it would drop `?id=` and the filters here. Ideas
 * pages exist in every language, so the same query is valid in each.
 */
export function LanguageLinksKeepQuery() {
  const pathname = usePathname()
  const params = useSearchParams()
  // biome-ignore lint/correctness/useExhaustiveDependencies: A new path remounts the header, so its links need patching again.
  useEffect(() => {
    const query = new URLSearchParams(params)
    for (const name of ["preview", "sign_in_error", "merged"]) query.delete(name)
    const search = query.toString()
    const update = () => {
      for (const link of document.querySelectorAll<HTMLAnchorElement>(".language-options a[lang]")) {
        const path = link.getAttribute("href")?.split("?")[0] ?? ""
        if (/^\/(?:en|ru|es)\/ideas(?:\/|$)/.test(path)) link.setAttribute("href", search ? `${path}?${search}` : path)
      }
    }
    update()
    const frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [pathname, params])
  return null
}
