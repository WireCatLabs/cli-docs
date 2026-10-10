"use client"

import { usePathname } from "next/navigation"
import { Editorial } from "@/components/landing/editorial"
import { languageSwitcherHtml } from "@/lib/language-switcher"

/** One reviewed navigation for every public page. */
export function SiteHeader({ lang, html }: { lang: string; html: string }) {
  const pathname = usePathname()
  const header = html.replace(
    /<details class="language-switcher editorial-language"[\s\S]*?<\/details>/,
    languageSwitcherHtml(lang, pathname),
  )
  return <Editorial key={pathname} html={header} lang={lang} className="public-header" />
}
