"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useThemeToggle } from "@/components/use-theme-toggle"
import { analyticsEnabled, openConsentBanner } from "@/lib/analytics"
import { wirecatLogoSvg } from "@/lib/brand"
import { detectOs } from "@/lib/desktop-releases"
import { bindDisclosureMenus } from "@/lib/disclosure-menus"
import { downloadWords } from "@/lib/download"
import { languageSwitcherHtml } from "@/lib/language-switcher"
import { homePath, localeFromPath } from "@/lib/site-routes"
import siteConfig from "@/site.config.json"

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character,
  )

/** Shared footer exported from the same reviewed source as the landing. */
export function SiteFooter({
  html,
  variant = "landing",
  blogPaths,
}: {
  html: string
  variant?: "landing" | "docs"
  blogPaths?: string[]
}) {
  const pathname = usePathname()
  // Add configured contacts at render time so builds do not need to regenerate landing snapshots.
  const { email, telegram } = siteConfig.contacts
  const contacts = `<ul class="foot-contacts"><li><!--email_off--><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a><!--/email_off--></li><li><a href="${escapeHtml(telegram)}">Telegram · ${escapeHtml(`@${new URL(telegram).pathname.replace(/^\//, "")}`)}</a></li></ul>`
  const lang = localeFromPath(pathname)
  const legal = {
    en: { privacy: "Privacy", terms: "Terms", settings: "Cookie settings" },
    ru: { privacy: "Конфиденциальность", terms: "Условия", settings: "Настройки cookie" },
    es: { privacy: "Privacidad", terms: "Términos", settings: "Configuración de cookies" },
  }[lang] ?? { privacy: "Privacy", terms: "Terms", settings: "Cookie settings" }
  let footerHtml = html.includes('class="foot-contacts"')
    ? html
    : html.replace(/(<div class="foot-brand">[\s\S]*?<\/p>)/, (brand) => `${brand}${contacts}`)
  footerHtml = footerHtml.replace(
    /<a class="mark"[^>]*>[\s\S]*?<\/a>/,
    `<a class="wirecat-brand" href="${homePath(lang)}"><span class="wirecat-logo" role="img" aria-label="WireCat">${wirecatLogoSvg}</span></a>`,
  )
  footerHtml = footerHtml.replace(
    /<details class="language-switcher editorial-language"[\s\S]*?<\/details>/,
    languageSwitcherHtml(lang, pathname, blogPaths),
  )
  if (!footerHtml.includes('class="foot-legal"'))
    footerHtml = footerHtml.replace(
      '<div class="footer-controls">',
      `<span class="foot-legal"><a class="animated-text-link" href="/${lang}/privacy"><span class="link-label">${escapeHtml(legal.privacy)}</span></a><a class="animated-text-link" href="/${lang}/terms"><span class="link-label">${escapeHtml(legal.terms)}</span></a><button type="button" class="foot-consent" data-consent-settings hidden>${escapeHtml(legal.settings)}</button></span><div class="footer-controls">`,
    )
  footerHtml = footerHtml.replaceAll('href="/en"', 'href="/"')
  const rootRef = useRef<HTMLDivElement>(null)
  useThemeToggle(rootRef, localeFromPath(pathname))
  // biome-ignore lint/correctness/useExhaustiveDependencies: A new route replaces the footer language subtree and requires fresh listeners.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = new AbortController()
    bindDisclosureMenus(root, "[data-language-switcher]", controller.signal)
    const brand = root.querySelector<HTMLAnchorElement>(".foot-brand > a")
    if (brand) brand.href = homePath(lang)
    const consent = root.querySelector<HTMLButtonElement>("[data-consent-settings]")
    if (consent && analyticsEnabled(window.location.hostname)) {
      consent.hidden = false
      consent.addEventListener("click", openConsentBanner, { signal: controller.signal })
    }
    const os = detectOs(navigator)
    if (os === "macos" || os === "windows" || os === "linux")
      for (const label of root.querySelectorAll<HTMLElement>(".connect-download-label"))
        label.textContent = downloadWords(lang).downloadFor[os]
    return () => controller.abort()
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
