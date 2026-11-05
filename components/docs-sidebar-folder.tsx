"use client"

import type { Folder } from "fumadocs-core/page-tree"
import { useFolderDepth } from "fumadocs-ui/components/sidebar/base"
import { useTreePath } from "fumadocs-ui/contexts/tree"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { createContext, type ReactNode, useState } from "react"

/** Pages inside a folding section are still top-level pages, so they keep the top-level look. */
export const SectionContext = createContext(false)

export const sectionNameClass = "text-sm font-semibold text-fd-foreground"

export function DocsSidebarFolder({ item, children }: { item: Folder; children: ReactNode }) {
  const pathname = usePathname()
  const path = useTreePath()
  const depth = useFolderDepth()
  const section = item.$id?.startsWith("section-") ?? false
  const [override, setOverride] = useState<{ path: string; open: boolean }>()
  const folder = item.$ref?.folder.replaceAll("\\", "/").split("/").filter(Boolean).at(-1)
  const page = item.index ?? item.children.find((child) => child.type === "page")
  const tool =
    folder === "tg" || folder === "max"
      ? folder
      : item.name === "Telegram"
        ? "tg"
        : item.name === "MAX"
          ? "max"
          : page?.type === "page"
            ? /\/docs\/(tg|max)\/?$/.exec(page.url)?.[1]
            : undefined
  const active = tool
    ? /\/docs\/(tg|max)(?:\/|$)/.exec(pathname)?.[1] === tool
    : path.includes(item) || pathname.replace(/\/$/, "") === item.index?.url.replace(/\/$/, "")
  const open =
    item.collapsible === false || (override?.path === pathname ? override.open : active || Boolean(item.defaultOpen))
  const toggle = () => setOverride({ path: pathname, open: !open })
  const tone = depth === 0 ? "text-fd-foreground/85" : "text-fd-muted-foreground"
  const row = section
    ? `relative mt-4 flex w-full items-center gap-2 rounded-lg p-2 text-start ${sectionNameClass} hover:bg-fd-accent/50 [&_svg]:size-4 [&_svg]:shrink-0`
    : `relative flex w-full items-center gap-2 rounded-lg p-2 text-start text-sm ${tone} hover:bg-fd-accent/50 hover:text-fd-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0`
  const chevron = <ChevronDown aria-hidden="true" className={`ml-auto${open ? "" : " -rotate-90"}`} />
  // A link inside the toggle would nest two controls, so a folder with its own page gets a separate toggle.
  return (
    <div data-guide-tool={tool} data-open={open} className="group/guide">
      {item.index ? (
        <div className={row}>
          <Link href={item.index.url} className="flex flex-1 items-center gap-2 focus-visible:outline-2">
            {item.icon}
            {item.name}
          </Link>
          {item.collapsible !== false && (
            <button type="button" aria-expanded={open} onClick={toggle} className="rounded focus-visible:outline-2">
              <span className="sr-only">{item.name}</span>
              {chevron}
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          onClick={item.collapsible === false ? undefined : toggle}
          className={`${row} focus-visible:outline-2 focus-visible:outline-offset-2`}
        >
          {item.icon}
          {item.name}
          {chevron}
        </button>
      )}
      {section ? (
        <div hidden={!open} className="flex flex-col gap-0.5">
          <SectionContext.Provider value={true}>{children}</SectionContext.Provider>
        </div>
      ) : (
        <div hidden={!open} className="relative ml-2.5 flex flex-col gap-0.5 border-l border-fd-border pl-0.5 pt-0.5">
          {children}
        </div>
      )}
    </div>
  )
}
