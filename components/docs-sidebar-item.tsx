"use client"

import type { Item } from "fumadocs-core/page-tree"
import { SidebarItem, useFolderDepth } from "fumadocs-ui/components/sidebar/base"
import { usePathname } from "next/navigation"

export function DocsSidebarItem({ item }: { item: Item }) {
  const pathname = usePathname()
  const depth = useFolderDepth()
  const exact = pathname.replace(/\/$/, "") === item.url.replace(/\/$/, "")
  const active = exact
  return (
    <SidebarItem
      href={item.url}
      external={item.external}
      icon={item.icon}
      active={active}
      aria-current={exact ? "page" : active ? "location" : undefined}
      style={{ paddingInlineStart: `calc(${2 + 3 * depth} * var(--spacing))` }}
      className={`relative flex items-center gap-2 rounded-lg p-2 text-start text-sm text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors data-[active=true]:bg-fd-primary/10 data-[active=true]:font-medium data-[active=true]:text-fd-primary hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 ${depth >= 1 ? "data-[active=true]:before:content-[''] data-[active=true]:before:bg-fd-primary data-[active=true]:before:absolute data-[active=true]:before:w-px data-[active=true]:before:inset-y-2.5 data-[active=true]:before:inset-s-2.5" : ""}`}
    >
      {item.name}
    </SidebarItem>
  )
}
