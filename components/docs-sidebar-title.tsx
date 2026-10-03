"use client"

import { useI18n } from "fumadocs-ui/contexts/i18n"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"
import { wordsFor } from "@/lib/words"

export function DocsSidebarTitle(props: ComponentProps<"a">) {
  const pathname = usePathname()
  const { locale } = useI18n()
  const lang = locale ?? "en"
  const tool = pathname.match(/^\/(?:en|ru|es)\/docs\/(tg|max)(?:\/|$)/)?.[1]
  const title = tool === "tg" ? "Telegram" : tool === "max" ? "MAX" : wordsFor(lang).navigation.start
  return (
    <Link {...props} href={`/${lang}/docs${tool ? `/${tool}` : ""}`} data-docs-section-title>
      {title}
    </Link>
  )
}
