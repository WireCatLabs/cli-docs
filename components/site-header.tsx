"use client"

import { ChevronDown, Globe, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useThemeToggle } from "@/components/use-theme-toggle"
import { WirecatLogo } from "@/components/wirecat-logo"
import { aboutCopy } from "@/lib/about"

const labels = {
  en: { language: "Language", navigation: "Site navigation" },
  ru: { language: "Язык", navigation: "Навигация по сайту" },
  es: { language: "Idioma", navigation: "Navegación del sitio" },
}

/** Shared public-site shell: the landing and About never own separate headers. */
export function SiteHeader({ lang }: { lang: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const words = aboutCopy[lang as keyof typeof aboutCopy] ?? aboutCopy.en
  const ui = labels[lang as keyof typeof labels] ?? labels.en
  useThemeToggle(rootRef, lang)
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const controller = new AbortController()
    const language = root.querySelector<HTMLDetailsElement>(".lang")
    if (language) language.open = false
    const onScroll = () => root.classList.toggle("scrolled", scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true, signal: controller.signal })
    onScroll()
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && language?.open) {
          language.open = false
          language.querySelector<HTMLElement>("summary")?.focus()
          event.preventDefault()
        }
      },
      { signal: controller.signal },
    )
    document.addEventListener(
      "click",
      (event) => {
        if (language && event.target instanceof Node && !language.contains(event.target)) language.open = false
      },
      { signal: controller.signal },
    )
    const nav = root.querySelector<HTMLElement>("nav.site")
    const glide = nav?.querySelector<HTMLElement>(".glide")
    const move = (link: HTMLElement | null) => {
      if (!glide) return
      glide.style.opacity = link ? "1" : "0"
      if (link) {
        glide.style.width = `${link.offsetWidth}px`
        glide.style.transform = `translateX(${link.offsetLeft}px)`
      }
    }
    const active = pathname.endsWith("/about") ? nav?.querySelector<HTMLElement>('a[aria-current="page"]') : null
    const restore = () => move(active ?? null)
    for (const link of nav?.querySelectorAll<HTMLElement>("a") ?? []) {
      link.addEventListener("mouseenter", () => move(link), { signal: controller.signal })
      link.addEventListener("focus", () => move(link), { signal: controller.signal })
    }
    nav?.addEventListener("mouseleave", restore, { signal: controller.signal })
    nav?.addEventListener(
      "focusout",
      (event) => {
        if (!(event.relatedTarget instanceof Node) || !nav.contains(event.relatedTarget)) restore()
      },
      { signal: controller.signal },
    )
    const observer = new ResizeObserver(restore)
    if (nav) observer.observe(nav)
    restore()
    return () => {
      controller.abort()
      observer.disconnect()
    }
  }, [pathname])
  return (
    <div ref={rootRef} className="bar site-header" id="bar">
      <header className="top wrap">
        <Link
          prefetch={false}
          className="wirecat-brand site-brand"
          href={`/${lang}`}
          aria-label={`WireCat · ${words.back}`}
        >
          <WirecatLogo />
        </Link>
        <div className="right">
          <button className="theme-toggle" type="button" aria-label="Switch theme" title="Switch theme">
            <Sun className="theme-sun" strokeWidth={1.7} aria-hidden="true" />
            <Moon className="theme-moon" strokeWidth={1.7} aria-hidden="true" />
          </button>
          <details className="lang">
            <summary aria-label={ui.language}>
              <Globe strokeWidth={1.6} aria-hidden="true" />
              <span>{lang.toUpperCase()}</span>
              <ChevronDown className="dn" aria-hidden="true" />
            </summary>
            <div className="lang-menu">
              {[
                ["en", "English"],
                ["ru", "Русский"],
                ["es", "Español"],
              ].map(([locale, label]) => (
                <a
                  key={locale}
                  href={pathname.replace(/^\/(en|ru|es)(?=\/|$)/, `/${locale}`)}
                  lang={locale}
                  aria-current={locale === lang ? "page" : undefined}
                >
                  {label}
                </a>
              ))}
            </div>
          </details>
          <nav className="site" aria-label={ui.navigation}>
            <span className="glide" aria-hidden="true" />
            <Link prefetch={false} href={`/${lang}/docs/tg`}>
              Telegram
            </Link>
            <Link prefetch={false} href={`/${lang}/docs/max`}>
              MAX
            </Link>
            <Link
              prefetch={false}
              href={`/${lang}/about`}
              aria-current={pathname === `/${lang}/about` ? "page" : undefined}
            >
              {words.nav}
            </Link>
          </nav>
        </div>
      </header>
    </div>
  )
}
