"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useThemeToggle } from "@/components/use-theme-toggle"
import { wirecatLogoSvg } from "@/lib/brand"
import { notifyCopyFeedback } from "@/lib/copy-feedback"
import { prepareInstallationButton } from "@/lib/installation-command"
import { copiedInstallationTool, trackSiteEvent } from "@/lib/site-events"
import { homePath, localeFromPath, localizedPath } from "@/lib/site-routes"
import siteConfig from "@/site.config.json"

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character,
  )

/** Shared footer exported from the same reviewed source as the landing. */
export function SiteFooter({ html, variant = "landing" }: { html: string; variant?: "landing" | "docs" }) {
  const pathname = usePathname()
  // Add configured contacts at render time so builds do not need to regenerate landing snapshots.
  const { email, telegram } = siteConfig.contacts
  const contacts = `<ul class="foot-contacts"><li><!--email_off--><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a><!--/email_off--></li><li><a href="${escapeHtml(telegram)}">Telegram · ${escapeHtml(`@${new URL(telegram).pathname.replace(/^\//, "")}`)}</a></li></ul>`
  const lang = localeFromPath(pathname)
  const installLabel =
    {
      en: "Telegram · CLI + agent skill",
      ru: "Telegram · CLI + skill",
      es: "Telegram · CLI + skill del agente",
    }[lang] ?? "Telegram · CLI + agent skill"
  const command = html.match(/<span class="cmd">[\s\S]*?<\/span>/)?.[0]
  let footerHtml = html.includes('class="foot-contacts"')
    ? html
    : html.replace(/(<div class="foot-brand">[\s\S]*?<\/p>)/, (brand) => `${brand}${contacts}`)
  footerHtml = footerHtml.replace(
    /<a class="mark"[^>]*>[\s\S]*?<\/a>/,
    `<a class="wirecat-brand" href="${homePath(lang)}"><span class="wirecat-logo" role="img" aria-label="WireCat">${wirecatLogoSvg}</span></a>`,
  )
  if (command && !footerHtml.includes('class="footer-install"')) {
    footerHtml = footerHtml
      .replace(command, "")
      .replace(
        '<div class="foot-bottom">',
        `<div class="footer-install"><span class="footer-install-label">${escapeHtml(installLabel)}</span>${command}</div><div class="foot-bottom">`,
      )
  }
  footerHtml = footerHtml.replaceAll('href="/en"', 'href="/"')
  const rootRef = useRef<HTMLDivElement>(null)
  useThemeToggle(rootRef, localeFromPath(pathname))
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    for (const link of root.querySelectorAll<HTMLAnchorElement>(".footer-language a")) {
      const locale = localeFromPath(new URL(link.href).pathname)
      link.href = localizedPath(pathname, locale)
    }
    const brand = root.querySelector<HTMLAnchorElement>(".foot-brand > a")
    if (brand) brand.href = homePath(lang)
    for (const code of root.querySelectorAll<HTMLElement>(".cmd code")) code.tabIndex = 0
    const button = root.querySelector<HTMLButtonElement>("[data-copy]")
    if (button) prepareInstallationButton(button)
    const label = button?.textContent ?? ""
    button?.addEventListener(
      "click",
      async () => {
        try {
          await navigator.clipboard.writeText(button.dataset.copy ?? "")
          if (controller.signal.aborted) return
          notifyCopyFeedback(true)
          button.dataset.copied = ""
          button.textContent = { en: "Copied", ru: "Скопировано", es: "Copiado" }[lang] ?? "Copied"
          const tool = copiedInstallationTool(button.dataset.copy ?? "")
          if (tool) trackSiteEvent("installation_command_copy", { tool, locale: lang, surface: "footer" })
          clearTimeout(timer)
          timer = setTimeout(() => {
            button.textContent = label
            delete button.dataset.copied
          }, 3000)
        } catch {
          if (controller.signal.aborted) return
          notifyCopyFeedback(false)
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
  }, [pathname, lang])
  return (
    <div
      ref={rootRef}
      className={`site-footer-shell site-footer-${variant}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Reviewed repository-owned footer, exported without scripts or user input.
      dangerouslySetInnerHTML={{ __html: footerHtml }}
    />
  )
}
