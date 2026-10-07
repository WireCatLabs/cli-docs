"use client"

import { ArrowRight, List } from "lucide-react"

export function DocsContentsHint({ lang }: { lang: string }) {
  const words = {
    en: { desktop: "Find a section in the contents on the right", mobile: "Open contents to find a section" },
    ru: { desktop: "Найдите раздел в оглавлении справа", mobile: "Открыть оглавление и выбрать раздел" },
    es: { desktop: "Busca una sección en el índice de la derecha", mobile: "Abrir el índice para elegir una sección" },
  }[lang] ?? { desktop: "Find a section in the contents on the right", mobile: "Open contents to find a section" }
  return (
    <button
      type="button"
      className="my-4 flex w-full items-center gap-3 rounded-lg border bg-fd-card px-4 py-3 text-start text-sm font-medium text-fd-foreground"
      aria-controls="nd-toc-popover nd-toc"
      onClick={() => {
        if (window.matchMedia("(min-width: 80rem)").matches) {
          document.querySelector<HTMLAnchorElement>("#nd-toc a")?.focus()
        } else {
          const details = document.querySelector<HTMLDetailsElement>("#nd-toc-popover details")
          if (details) {
            details.open = true
            details.querySelector<HTMLElement>("summary")?.focus()
          }
        }
      }}
    >
      <List className="size-5 shrink-0" aria-hidden="true" />
      <span className="hidden xl:inline">{words.desktop}</span>
      <span className="xl:hidden">{words.mobile}</span>
      <ArrowRight className="ml-auto size-5 shrink-0" aria-hidden="true" />
    </button>
  )
}
