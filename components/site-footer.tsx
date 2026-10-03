"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

/** Shared footer exported from the same reviewed source as the landing. */
export function SiteFooter({ html }: { html: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    for (const link of root.querySelectorAll<HTMLAnchorElement>(".langs a")) {
      const locale = new URL(link.href).pathname.split("/")[1]
      link.href = pathname.replace(/^\/(en|ru|es)(?=\/|$)/, `/${locale}`)
    }
    const brand = root.querySelector<HTMLAnchorElement>(".foot-brand .mark")
    if (brand) brand.href = `/${pathname.split("/")[1]}`
    const button = root.querySelector<HTMLButtonElement>("[data-copy]")
    const label = button?.textContent ?? ""
    button?.addEventListener(
      "click",
      async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copy ?? "")
          if (controller.signal.aborted) return
          button.textContent = { en: "Copied", ru: "Скопировано", es: "Copiado" }[pathname.split("/")[1]] ?? "Copied"
          clearTimeout(timer)
          timer = setTimeout(() => {
            button.textContent = label
          }, 1600)
        } catch {
          const code = root.querySelector(".cmd code")
          if (code) {
            const range = document.createRange()
            range.selectNodeContents(code)
            const selection = getSelection()
            selection?.removeAllRanges()
            selection?.addRange(range)
          }
        }
      },
      { signal: controller.signal },
    )
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [pathname])
  // biome-ignore lint/security/noDangerouslySetInnerHtml: Reviewed repository-owned footer, exported without scripts or user input.
  return <div ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} />
}
