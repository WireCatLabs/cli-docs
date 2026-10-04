"use client"

import { Popover } from "@base-ui/react/popover"
import { Info, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { type DocTermId, docTerm } from "@/lib/doc-terms"

const labels = {
  en: { more: "More about", guide: "Read the guide", close: "Close explanation" },
  ru: { more: "Подробнее", guide: "Открыть инструкцию", close: "Закрыть пояснение" },
  es: { more: "Más sobre", guide: "Leer la guía", close: "Cerrar explicación" },
}

export function DocTerm({ term, label, lang = "en" }: { term: DocTermId; label?: string; lang?: string }) {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  const entry = docTerm(term, lang)
  const ui = labels[lang as keyof typeof labels] ?? labels.en
  return (
    <span className="docs-term">
      {label ?? entry.title}
      <Popover.Root>
        <Popover.Trigger
          openOnHover
          disabled={!ready}
          delay={200}
          closeDelay={200}
          className="docs-term-trigger"
          aria-label={`${ui.more}: ${label ?? entry.title}`}
        >
          <Info size={14} aria-hidden="true" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner
            side="top"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            className="docs-term-positioner"
          >
            <Popover.Popup className="docs-term-popup">
              <Popover.Title className="docs-term-title">{entry.title}</Popover.Title>
              <Popover.Description className="docs-term-description">{entry.description}</Popover.Description>
              <Link href={`/${lang}/docs/${entry.page}`} className="docs-term-link">
                {ui.guide} →
              </Link>
              <Popover.Close className="docs-term-close" aria-label={ui.close}>
                <X size={15} aria-hidden="true" />
              </Popover.Close>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </span>
  )
}
