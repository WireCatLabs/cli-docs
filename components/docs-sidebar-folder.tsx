"use client"

import type { Folder } from "fumadocs-core/page-tree"
import { useTreePath } from "fumadocs-ui/contexts/tree"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ReactNode, useState } from "react"

export function DocsSidebarFolder({ item, children }: { item: Folder; children: ReactNode }) {
  const pathname = usePathname()
  const path = useTreePath()
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
  const row =
    "relative flex w-full items-center gap-2 rounded-lg p-2 text-start text-sm text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0"
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
      <div hidden={!open} className="relative ml-2.5 flex flex-col gap-0.5 border-l border-fd-border pl-0.5 pt-0.5">
        {children}
      </div>
    </div>
  )
}
