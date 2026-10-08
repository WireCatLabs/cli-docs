"use client"

import { useTOCItems } from "fumadocs-ui/components/toc"
import { useI18n } from "fumadocs-ui/contexts/i18n"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef } from "react"

export function DocsTocPopover() {
  const items = useTOCItems()
  const { locale } = useI18n()
  const title = { en: "On this page", ru: "На этой странице", es: "En esta página" }[locale ?? "en"] ?? "On this page"
  const action =
    { en: "Contents · tap to open", ru: "Оглавление · нажмите, чтобы открыть", es: "Índice · pulsa para abrir" }[
      locale ?? "en"
    ] ?? "Contents · tap to open"
  const details = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    if (!items.length) return
    const node = details.current
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape" && node?.open) {
        node.open = false
        node.querySelector<HTMLElement>("summary")?.focus()
        event.preventDefault()
      }
    }
    node?.addEventListener("keydown", dismiss)
    return () => node?.removeEventListener("keydown", dismiss)
  }, [items.length])
  if (!items.length) return null
  return (
    <nav
      id="nd-toc-popover"
      aria-label={title}
      className="sticky top-(--fd-docs-row-2) z-10 border-b bg-fd-background [grid-area:toc-popover] h-(--fd-toc-popover-height) xl:hidden max-xl:layout:[--fd-toc-popover-height:--spacing(10)]"
    >
      <details ref={details} className="group">
        <summary className="flex h-10 cursor-pointer list-none items-center justify-between px-4 text-sm text-fd-muted-foreground md:px-6">
          {action}
          <ChevronDown className="size-4 group-open:rotate-180" aria-hidden="true" />
        </summary>
        <ul className="absolute inset-x-0 max-h-72 overflow-auto border-t bg-fd-background px-4 py-3 text-sm shadow-lg">
          {items.map((item) => (
            <li key={item.url} style={{ paddingInlineStart: Math.max(0, item.depth - 2) * 12 }}>
              <a
                className="block py-1.5 text-fd-foreground"
                href={item.url}
                onClick={() => {
                  if (details.current) details.current.open = false
                }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  )
}
