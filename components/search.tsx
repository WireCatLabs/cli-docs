"use client"
import { experimental_useSearch as useSearch } from "fumadocs-core/search/client"
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search"
import { useI18n } from "fumadocs-ui/contexts/i18n"
import { usePathname } from "next/navigation"
import { useCallback } from "react"
import { compressedStaticClient } from "@/lib/compressed-search-client"
import { preferredSearchTool } from "@/lib/search-intents"

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n() // (optional) for i18n
  const pathname = usePathname()
  const run = useCallback(
    async (value: string) => {
      const results = await compressedStaticClient({ locale, from: `/api/search/${locale ?? "en"}` }).search(value)
      const tool = preferredSearchTool(value, pathname)
      if (!tool) return results
      const rank = (url: string) => (/\/docs\/(tg|max)(?:\/|#|$)/.exec(url)?.[1] === tool ? 0 : 1)
      return results.toSorted((a, b) => rank(a.url) - rank(b.url))
    },
    [locale, pathname],
  )
  const search = useSearch(run)

  return (
    <SearchDialog {...search} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput
            aria-expanded={!!search.data?.items.length}
            placeholder={
              {
                en: "Task, command or error — e.g. command not found",
                ru: "Задача, команда или ошибка — например, команда не найдена",
                es: "Tarea, comando o error — por ejemplo, comando no encontrado",
              }[locale ?? "en"] ?? "Task, command or error"
            }
          />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={search.data?.items ?? null} />
      </SearchDialogContent>
    </SearchDialog>
  )
}
