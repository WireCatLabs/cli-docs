"use client"

import { useI18n } from "fumadocs-ui/contexts/i18n"
import Link from "next/link"
import type { ComponentProps } from "react"
import { wordsFor } from "@/lib/words"

export function DocsSidebarTitle(props: ComponentProps<"a">) {
  const { locale } = useI18n()
  const lang = locale ?? "en"
  return (
    <Link {...props} href={`/${lang}/docs`} data-docs-section-title>
      {wordsFor(lang).docs}
    </Link>
  )
}
