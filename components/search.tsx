"use client"
import { useDocsSearch } from "fumadocs-core/search/client"
import { staticClient } from "fumadocs-core/search/client/orama-static"
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
import { preferredSearchTool } from "@/lib/search-intents"

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale } = useI18n() // (optional) for i18n
  const pathname = usePathname()
  const baseClient = staticClient({ locale })
  const { search, setSearch, query } = useDocsSearch({
    client: {
      deps: [...(baseClient.deps ?? []), pathname],
      search: async (value) => {
        const results = await baseClient.search(value)
        const tool = preferredSearchTool(value, pathname)
        if (!tool) return results
        const rank = (url: string) => (/\/docs\/(tg|max)(?:\/|#|$)/.exec(url)?.[1] === tool ? 0 : 1)
        return results.toSorted((a, b) => rank(a.url) - rank(b.url))
      },
    },
  })

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput
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
        <SearchDialogList items={query.data !== "empty" ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  )
}
