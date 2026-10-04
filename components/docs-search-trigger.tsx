"use client"

import { useI18n } from "fumadocs-ui/contexts/i18n"
import { useSearchContext } from "fumadocs-ui/contexts/search"
import { Search } from "lucide-react"

/** Set provider state directly so the dialog can load on the first click. */
export function DocsSearchTrigger({ full = false, className = "" }: { full?: boolean; className?: string }) {
  const { open, setOpenSearch, hotKey } = useSearchContext()
  const { locale } = useI18n()
  const label = { en: "Search", ru: "Поиск", es: "Buscar" }[locale ?? "en"] ?? "Search"
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={() => setOpenSearch(true)}
      className={`${full ? "items-center gap-2 rounded-lg border bg-fd-secondary/50 p-1.5 ps-2 text-sm text-fd-muted-foreground" : "rounded-md p-2"} hover:bg-fd-accent hover:text-fd-accent-foreground ${className}`}
    >
      <Search className="size-4" aria-hidden="true" />
      {full && (
        <>
          {label}
          <span className="ms-auto inline-flex gap-0.5" aria-hidden="true">
            {hotKey.map((key, index) => (
              <kbd
                key={typeof key.key === "string" ? key.key : `modifier-${index}`}
                className="rounded-md border bg-fd-background px-1.5"
              >
                {key.display}
              </kbd>
            ))}
          </span>
        </>
      )}
    </button>
  )
}
