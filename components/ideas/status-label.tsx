import { CalendarClock, CircleCheck, CircleDot, CircleSlash, Hammer } from "lucide-react"
import type { IdeaStatus } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"

const icons = {
  new: CircleDot,
  planned: CalendarClock,
  in_progress: Hammer,
  done: CircleCheck,
  not_planned: CircleSlash,
}

export function StatusIcon({ status }: { status: IdeaStatus }) {
  const Icon = icons[status]
  return <Icon aria-hidden="true" />
}

export function StatusLabel({ lang, status }: { lang: string; status: IdeaStatus }) {
  return (
    <span className="idea-status" data-status={status}>
      <StatusIcon status={status} />
      {ideasWords(lang).statuses[status]}
    </span>
  )
}
