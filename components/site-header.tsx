"use client"

import { usePathname } from "next/navigation"
import { Editorial } from "@/components/landing/editorial"
import { localizedPath } from "@/lib/site-routes"

/** One reviewed navigation for every public page. */
export function SiteHeader({ lang, html }: { lang: string; html: string }) {
  const pathname = usePathname()
  const header = html.replace(
    /href="[^"]*" lang="(en|ru|es)"/g,
    (_, locale: string) => `href="${localizedPath(pathname, locale)}" lang="${locale}"`,
  )
  return <Editorial key={pathname} html={header} lang={lang} className="public-header" />
}
