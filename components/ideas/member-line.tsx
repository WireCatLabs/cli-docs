"use client"

import { UserRound } from "lucide-react"
import Link from "next/link"
import { ideasPath } from "@/lib/ideas"
import { ideasWords } from "@/lib/ideas/words"
import { useMember, useReturnPath } from "./use-member"

/** Who is signed in, with the way to sign out or delete the account. */
export function MemberLine({ lang }: { lang: string }) {
  const words = ideasWords(lang).account
  const member = useMember()
  const here = useReturnPath(lang)
  if (!member) return null
  return (
    <p className="ideas-emails ideas-member">
      <UserRound aria-hidden="true" />
      <span>
        {words.memberLine(member.email)}{" "}
        <Link href={`${ideasPath(lang, "sign-in")}?next=${encodeURIComponent(here)}`}>{words.link}</Link>
      </span>
    </p>
  )
}
