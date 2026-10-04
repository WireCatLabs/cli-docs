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
            ? /\/docs\/(tg|max)(?:\/|$)/.exec(page.url)?.[1]
            : undefined
  const active = tool ? /\/docs\/(tg|max)(?:\/|$)/.exec(pathname)?.[1] === tool : path.includes(item)
  const open =
    item.collapsible === false || (override?.path === pathname ? override.open : active || Boolean(item.defaultOpen))
  return (
    <details
      open={open}
      data-guide-tool={tool}
      className="group/guide"
      onToggle={(event) => setOverride({ path: pathname, open: event.currentTarget.open })}
    >
      <summary className="relative flex w-full cursor-pointer list-none items-center gap-2 rounded-lg p-2 text-start text-sm text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden [&_svg]:size-4 [&_svg]:shrink-0">
        {item.icon}
        {item.index ? <Link href={item.index.url}>{item.name}</Link> : item.name}
        <ChevronDown aria-hidden="true" className="ml-auto -rotate-90 group-open/guide:rotate-0" />
      </summary>
      <div className="relative ml-2.5 flex flex-col gap-0.5 border-l border-fd-border pl-0.5 pt-0.5">{children}</div>
    </details>
  )
}
