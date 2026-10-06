"use client"

import type { Node } from "fumadocs-core/page-tree"
import { useI18n } from "fumadocs-ui/contexts/i18n"
import { useTreeContext } from "fumadocs-ui/contexts/tree"
import { useDocsLayout } from "fumadocs-ui/layouts/docs"
import { LanguageSelect } from "fumadocs-ui/layouts/shared/slots/language-select"
import { Languages, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ComponentProps, useEffect } from "react"
import { DocsSearchTrigger } from "@/components/docs-search-trigger"
import { WirecatLogo } from "@/components/wirecat-logo"
import { isGettingStarted, messengerHref } from "@/lib/docs-navigation"
import { homePath } from "@/lib/site-routes"
import { wordsFor } from "@/lib/words"

const pageUrls = (nodes: readonly Node[]): string[] =>
  nodes.flatMap((node) => {
    if (node.type === "page") return [node.url]
    if (node.type === "folder") return [...(node.index ? [node.index.url] : []), ...pageUrls(node.children)]
    return []
  })

export function MessengerSwitch({ lang, pages }: { lang: string; pages: string[] }) {
  const pathname = usePathname()
  return (
    <nav aria-label={wordsFor(lang).navigation.messenger} className="flex items-center gap-1 rounded-lg border p-1">
      {[
        { name: "tg", label: "Telegram" },
        { name: "max", label: "MAX" },
      ].map((tool) => {
        const active = pathname === `/${lang}/docs/${tool.name}` || pathname.startsWith(`/${lang}/docs/${tool.name}/`)
        return (
          <Link
            key={tool.name}
            href={messengerHref(pathname, lang, tool.name, pages)}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${active ? "bg-fd-primary text-fd-primary-foreground" : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"}`}
          >
            {tool.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function DocsHeader(props: ComponentProps<"header">) {
  const { slots } = useDocsLayout()
  const { full: tree } = useTreeContext()
  const { locale } = useI18n()
  const lang = locale ?? "en"
  const ui = wordsFor(lang).navigation
  const pathname = usePathname()
  const startActive = isGettingStarted(pathname)
  useEffect(() => {
    const dismiss = (event: KeyboardEvent) => {
      if (
        event.key !== "Escape" ||
        event.defaultPrevented ||
        (event.target instanceof Element && event.target.closest('[role="dialog"]'))
      )
        return
      const trigger = document.querySelector<HTMLButtonElement>(
        '#nd-subnav button[aria-controls="nd-sidebar-mobile"][aria-expanded="true"]',
      )
      if (trigger) {
        trigger.click()
        trigger.focus()
        event.preventDefault()
      }
    }
    document.addEventListener("keydown", dismiss)
    return () => document.removeEventListener("keydown", dismiss)
  }, [])

  return (
    <header
      {...props}
      id="nd-subnav"
      className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-fd-background/95 px-3 backdrop-blur-sm [grid-area:header] sm:gap-4 sm:px-5"
    >
      <Link href={homePath(lang)} className="wirecat-brand shrink-0">
        <WirecatLogo />
      </Link>
      <MessengerSwitch lang={lang} pages={pageUrls(tree.children).map((url) => url.slice(`/${lang}/docs/`.length))} />
      <Link
        href={`/${lang}/docs`}
        aria-current={startActive ? "location" : undefined}
        className={`hidden rounded-md px-3 py-2 text-sm transition-colors lg:block ${startActive ? "bg-fd-primary/10 font-medium text-fd-primary" : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"}`}
      >
        {ui.start}
      </Link>
      <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
        <DocsSearchTrigger full className="hidden w-44 md:flex" />
        <DocsSearchTrigger className="md:hidden" />
        <LanguageSelect aria-label={ui.language} className="gap-1.5 px-2 py-2">
          <Languages className="size-4" />
          <span className="text-xs font-medium uppercase">{lang}</span>
        </LanguageSelect>
        {slots.themeSwitch && <slots.themeSwitch className="hidden sm:flex" />}
        {slots.sidebar && (
          <slots.sidebar.trigger aria-label={ui.menu} className="rounded-md p-2 hover:bg-fd-accent md:hidden">
            <Menu className="size-4" />
          </slots.sidebar.trigger>
        )}
      </div>
    </header>
  )
}
