"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { bindDisclosureMenus } from "@/lib/disclosure-menus"
import { languageSwitcherHtml } from "@/lib/language-switcher"
import { localeFromPath } from "@/lib/site-routes"

export function LanguageSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)
  // biome-ignore lint/correctness/useExhaustiveDependencies: Route and locale changes replace the native details subtree, so its listeners must be rebound.
  useEffect(() => {
    if (!ref.current) return
    const controller = new AbortController()
    bindDisclosureMenus(ref.current, "[data-language-switcher]", controller.signal)
    return () => controller.abort()
  }, [pathname, lang])
  return (
    <div
      ref={ref}
      className="language-switcher-host"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shared repository-owned markup escapes route values and validates the locale.
      dangerouslySetInnerHTML={{ __html: languageSwitcherHtml(lang, pathname) }}
    />
  )
}

/** Adapter for the documentation layout's language slot. */
export function DocsLanguageSwitcher() {
  return <LanguageSwitcher lang={localeFromPath(usePathname())} />
}
export function LanguageSwitcherText() {
  return null
}
