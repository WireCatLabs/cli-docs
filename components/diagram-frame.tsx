"use client"

import { Maximize2, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const labels = {
  en: { open: "Enlarge diagram", close: "Close" },
  ru: { open: "Увеличить схему", close: "Закрыть" },
  es: { open: "Ampliar diagrama", close: "Cerrar" },
} as const

/** The same SVG grows to fill the screen rather than being copied into a dialog: a copy would repeat its ids. */
export function DiagramFrame({ svg, caption }: { svg: string; caption: string }) {
  const [open, setOpen] = useState(false)
  const lang = usePathname().split("/")[1]
  const text = labels[lang as keyof typeof labels] ?? labels.en

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: a click on the backdrop closes it; Esc and the button do the same from the keyboard.
    // biome-ignore lint/a11y/useKeyWithClickEvents: Esc is handled on window while it is open.
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-modal is set only together with role="dialog".
    <div
      className={open ? "fixed inset-0 z-50 flex items-center justify-center bg-fd-background p-6" : "relative"}
      onClick={open ? () => setOpen(false) : undefined}
      role={open ? "dialog" : undefined}
      aria-modal={open || undefined}
      aria-label={open ? caption : undefined}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          setOpen(!open)
        }}
        aria-label={open ? text.close : text.open}
        title={open ? text.close : text.open}
        className="absolute top-2 right-2 z-10 rounded-md border border-fd-border bg-fd-background p-1.5 text-fd-muted-foreground hover:text-fd-foreground"
      >
        {open ? <X className="size-4" /> : <Maximize2 className="size-4" />}
      </button>
      <div
        role="img"
        aria-label={caption}
        className={
          open
            ? "max-h-full w-full max-w-[1600px] overflow-auto [&_svg]:h-auto [&_svg]:w-full"
            : "cursor-zoom-in overflow-auto [&_svg]:h-auto [&_svg]:min-w-80 [&_svg]:max-w-full"
        }
        onClick={(event) => {
          event.stopPropagation()
          if (!open) setOpen(true)
        }}
        onKeyDown={(event) => event.key === "Enter" && !open && setOpen(true)}
        // biome-ignore lint/a11y/noNoninteractiveTabindex: Keyboard users can scroll a wide diagram.
        tabIndex={0}
      >
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: SVG is generated at build time from reviewed repository diagrams. */}
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </div>
  )
}
