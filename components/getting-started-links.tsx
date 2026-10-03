"use client"

import { Bot, Cable, Download, ListChecks, MessageSquare } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { wordsFor } from "@/lib/words"

export function GettingStartedLinks({ lang }: { lang: string }) {
  const ui = wordsFor(lang).navigation
  const pathname = usePathname()
  if (!/^\/(en|ru|es)\/docs\/(tg|max)(\/|$)/.test(pathname)) return null
  return (
    <nav aria-label={ui.start} className="mb-3 grid gap-0.5 border-b pb-4 text-sm">
      <p className="mb-1 px-2 text-xs font-semibold text-fd-muted-foreground">{ui.start}</p>
      {[
        { slug: "installation", label: ui.installation, icon: Download },
        { slug: "agents", label: ui.agents, icon: Bot },
        { slug: "first-tasks", label: ui.firstTasks, icon: ListChecks },
        { slug: "prompting", label: ui.prompting, icon: MessageSquare },
        { slug: "mcp", label: ui.mcp, icon: Cable },
      ].map(({ slug, label, icon: Icon }) => (
        <Link
          key={slug}
          href={`/${lang}/docs/${slug}`}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground"
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
