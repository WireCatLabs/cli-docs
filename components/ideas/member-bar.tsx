"use client"

import { ChevronRight, UserRound } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ideasPath, maskEmail } from "@/lib/ideas"
import type { Member } from "@/lib/ideas/types"
import { ideasWords } from "@/lib/ideas/words"
import { signInHref, useMember, useReturnPath } from "./use-member"

export const justSignedInKey = "wirecat-ideas-just-signed-in"

export function MemberAvatar({ member }: { member: Member }) {
  const letter = (member.name?.trim() || member.email).charAt(0).toUpperCase()
  return (
    <span className="ideas-avatar" aria-hidden="true">
      {letter}
    </span>
  )
}

/**
 * The account button beside the page title: the account page when signed in, sign-in when not. Its room is kept
 * while the session loads, so nothing moves when it appears. A forwarded sign-in link would sign the reader into
 * someone else's account, so the (masked) address stays in view.
 */
export function MemberBar({ lang }: { lang: string }) {
  const words = ideasWords(lang)
  const member = useMember()
  const here = useReturnPath(lang)
  const [just, setJust] = useState(false)
  useEffect(() => {
    try {
      if (sessionStorage.getItem(justSignedInKey)) {
        sessionStorage.removeItem(justSignedInKey)
        setJust(true)
      }
    } catch {}
  }, [])
  if (member === undefined) return <div className="ideas-member-bar" aria-hidden="true" />
  if (!member)
    return (
      <div className="ideas-member-bar">
        <Link className="ideas-member-chip" href={signInHref(lang, here)} aria-label={words.signIn.title}>
          <span className="ideas-avatar ideas-avatar-empty" aria-hidden="true">
            <UserRound />
          </span>
          <span className="ideas-member-label">{words.signIn.title}</span>
          <ChevronRight className="ideas-member-arrow" aria-hidden="true" />
        </Link>
      </div>
    )
  const who = maskEmail(member.email)
  return (
    <div className="ideas-member-bar">
      <Link
        className="ideas-member-chip"
        href={ideasPath(lang, "account")}
        aria-label={`${words.account.link}, ${who}`}
      >
        <MemberAvatar member={member} />
        <span className="ideas-member-who">
          <span className="ideas-member-label">{words.account.link}</span>
          <span className="ideas-member-email">{who}</span>
        </span>
        <ChevronRight className="ideas-member-arrow" aria-hidden="true" />
      </Link>
      {just && (
        <p className="ideas-member-just" role="status">
          {words.account.justSignedIn(who)}
        </p>
      )}
    </div>
  )
}
