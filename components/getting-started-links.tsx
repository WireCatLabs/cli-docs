"use client"

import { SidebarItem } from "fumadocs-ui/components/sidebar/base"
import { Bot, Cable, Download, LayoutGrid, ListChecks, MessageSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import { wordsFor } from "@/lib/words"

export function GettingStartedLinks({ lang }: { lang: string }) {
  const ui = wordsFor(lang).navigation
  const pathname = usePathname()
  return (
    <nav aria-label={ui.start} className="mb-3 grid gap-0.5 border-b pb-4 text-sm">
      <p className="mb-1 px-2 text-xs font-semibold text-fd-muted-foreground">{ui.start}</p>
      {[
        { slug: "installation", label: ui.installation, icon: Download },
        { slug: "agents", label: ui.agents, icon: Bot },
        { slug: "first-tasks", label: ui.firstTasks, icon: ListChecks },
        { slug: "features", label: ui.features, icon: LayoutGrid },
        { slug: "prompting", label: ui.prompting, icon: MessageSquare },
        { slug: "mcp", label: ui.mcp, icon: Cable },
      ].map(({ slug, label, icon: Icon }) => (
        <SidebarItem
          key={slug}
          href={`/${lang}/docs/${slug}`}
          active={pathname.replace(/\/$/, "") === `/${lang}/docs/${slug}`}
          aria-current={pathname.replace(/\/$/, "") === `/${lang}/docs/${slug}` ? "page" : undefined}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-fd-muted-foreground data-[active=true]:bg-fd-primary/10 data-[active=true]:font-medium data-[active=true]:text-fd-primary hover:bg-fd-accent hover:text-fd-foreground"
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          {label}
        </SidebarItem>
      ))}
    </nav>
  )
}
