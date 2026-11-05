"use client"

import type { Separator } from "fumadocs-core/page-tree"
import { SidebarSeparator } from "fumadocs-ui/components/sidebar/base"
import { sectionNameClass } from "./docs-sidebar-folder"

export function DocsSidebarSeparator({ item }: { item: Separator }) {
  return (
    <SidebarSeparator className={sectionNameClass}>
      {item.icon}
      {item.name}
    </SidebarSeparator>
  )
}
