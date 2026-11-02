"use client"

import { UserRound } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ideas, maskEmail } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"
import { signInHref, useMember, useReturnPath } from "./use-member"

export const justSignedInKey = "wirecat-ideas-just-signed-in"

/**
 * Who is signed in, on every ideas page. A forwarded sign-in link would sign the reader into someone else's
 * account, so the address stays in view with a way out.
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
  if (!member) return null
  const who = member.email ? maskEmail(member.email) : (member.name ?? words.aMember)
  return (
    <p className="ideas-member-bar" data-just={just || undefined} role={just ? "status" : undefined}>
      <UserRound aria-hidden="true" />
      <span>
        {just ? words.account.justSignedIn(who) : words.account.memberLine(who)}{" "}
        <span className="ideas-member-actions">
          {words.account.notYou}{" "}
          <button
            type="button"
            className="ideas-text-button"
            onClick={() =>
              ideas.signOut().then(
                () => window.location.reload(),
                () => window.location.reload(),
              )
            }
          >
            {words.signIn.signOut}
          </button>
          <span aria-hidden="true">·</span>
          <Link href={signInHref(lang, here)}>{words.account.link}</Link>
        </span>
      </span>
    </p>
  )
}
