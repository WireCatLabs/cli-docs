"use client"

import { ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ideas } from "@/lib/ideas"
import { type Idea, IdeasError, type Member } from "@/lib/ideas/types"
import { errorText, ideasWords } from "@/lib/ideas/words"
import { signInHref, useReturnPath } from "./use-member"

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
  const [error, setError] = useState("")
  const here = useReturnPath(lang)
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
        href={signInHref(lang, here)}
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
    setError("")
    setState({ voted: !before.voted, votes: before.votes + (before.voted ? -1 : 1) })
    try {
      setState(await (before.voted ? ideas.unvote(idea.id) : ideas.vote(idea.id)))
    } catch (failure) {
      const code = failure instanceof IdeasError ? failure.code : "unavailable"
      // The server already had it the way the reader wanted; only the button was stale.
      if (code === "already_voted") setState({ voted: true, votes: before.votes })
      else if (code === "not_voted") setState({ voted: false, votes: before.votes })
      else if (code === "sign_in_required") window.location.assign(signInHref(lang, here))
      else {
        setState(before)
        setError(errorText(lang, failure, words.voteFailed))
      }
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
      {error && (
        <span className="idea-vote-error" role="alert">
          {error}
        </span>
      )}
    </span>
  )
}
