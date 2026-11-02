"use client"

import { ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ideas, ideasPath } from "@/lib/ideas"
import type { Idea, Member } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import { useCurrentPath } from "./use-member"

/** The count is always shown; signed out, the button is a link to sign in that comes back here. */
export function VoteButton({
  lang,
  idea,
  member,
  wide = false,
}: {
  lang: string
  idea: Idea
  member: Member | null | undefined
  wide?: boolean
}) {
  const words = ideasWords(lang)
  const [state, setState] = useState({ voted: idea.voted, votes: idea.votes })
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const here = useCurrentPath(ideasPath(lang))
  const className = wide ? "idea-vote idea-vote-wide" : "idea-vote"
  const count = (
    <>
      <ChevronUp aria-hidden="true" />
      <span className="idea-vote-count">{state.votes}</span>
      <span className={wide ? "idea-vote-unit" : "sr-only"}>{words.votes(state.votes)}</span>
    </>
  )

  if (!member)
    return (
      <Link
        className={className}
        href={`${ideasPath(lang, "sign-in")}?next=${encodeURIComponent(here)}`}
        aria-label={`${words.signInToVote}: ${idea.title}, ${state.votes} ${words.votes(state.votes)}`}
        title={words.signInToVote}
        aria-disabled={member === undefined}
      >
        {count}
      </Link>
    )

  const toggle = async () => {
    const before = state
    setBusy(true)
    setFailed(false)
    setState({ voted: !before.voted, votes: before.votes + (before.voted ? -1 : 1) })
    try {
      const updated = await (before.voted ? ideas.unvote(idea.id) : ideas.vote(idea.id))
      setState({ voted: updated.voted, votes: updated.votes })
    } catch {
      setState(before)
      setFailed(true)
    }
    setBusy(false)
  }

  return (
    <span className="idea-vote-host">
      <button
        type="button"
        className={className}
        aria-pressed={state.voted}
        aria-label={`${state.voted ? words.unvote(idea.title) : words.vote(idea.title)}, ${state.votes} ${words.votes(state.votes)}`}
        disabled={busy}
        onClick={toggle}
      >
        {count}
      </button>
      {failed && (
        <span className="idea-vote-error" role="alert">
          {words.voteFailed}
        </span>
      )}
    </span>
  )
}
